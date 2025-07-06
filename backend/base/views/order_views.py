from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from base.utils import send_fcm_notification
from base.models import Product, Order, OrderItem, ShippingAddress, Coupon, UserShippingAddress
from base.serializers import ProductSerializer, OrderSerializer, UserShippingAddressSerializer
from django.core.mail import send_mail
from django.conf import settings
from django.utils.html import strip_tags
from django.core.mail import EmailMultiAlternatives


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_order_notification(request):
    send_fcm_notification(request.user, "Order Placed", "Your order was placed successfully.")
    return Response({'detail': 'Notification sent'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data

    orderItems = data.get('orderItems', [])
    if not orderItems or len(orderItems) == 0:
        return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)

    itemsPrice = float(data.get('itemsPrice', 0))
    shippingPrice = float(data.get('shippingPrice', 0))
    taxPrice = float(data.get('taxPrice', 0))
    paymentMethod = data.get('paymentMethod', '')

    coupon_code = data.get('coupon')
    discountAmount = 0
    coupon_obj = None

    if coupon_code:
        try:
            coupon_obj = Coupon.objects.get(code=coupon_code)
            if coupon_obj.discount_type == 'percent':
                discountAmount = itemsPrice * (coupon_obj.discount_value / 100)
            else:
                discountAmount = coupon_obj.discount_value
        except Coupon.DoesNotExist:
            return Response({'detail': 'Invalid coupon code'}, status=400)

    discountedTotal = round(itemsPrice + shippingPrice + taxPrice - discountAmount, 2)

    # Create order
    order = Order.objects.create(
        user=user,
        paymentMethod=paymentMethod,
        itemsPrice=itemsPrice,
        shippingPrice=shippingPrice,
        taxPrice=taxPrice,
        totalPrice=discountedTotal,
        discount=discountAmount,
        coupon=coupon_obj,
    )

    # Create shipping address
    shipping_data = data.get('shippingAddress', {})
    shipping_address = ShippingAddress.objects.create(
        order=order,
        address=shipping_data.get('address', ''),
        city=shipping_data.get('city', ''),
        postalCode=shipping_data.get('postalCode', ''),
        country=shipping_data.get('country', 'India'),
    )

    # Create order items and update stock
    for item in orderItems:
        product = Product.objects.get(_id=item['product'])

        OrderItem.objects.create(
            product=product,
            order=order,
            name=product.name,
            qty=item['qty'],
            price=item['price'],
            image=product.image.url,
        )

        product.countInStock -= item['qty']
        product.save()
        
    items_html = ""
    for item in order.orderitem_set.all():
        items_html += f"""
        <tr>
            <td style="padding: 5px;">
                <img src="{request.build_absolute_uri(item.image)}" alt="{item.name}" width="60" height="90" style="border:1px solid #ddd;"/>
            </td>
            <td style="padding: 5px;">{item.name}</td>
            <td style="padding: 5px;">Qty: {item.qty}</td>
            <td style="padding: 5px;">₹{item.price:.2f}</td>
        </tr>
        """

    subject = f"Order Confirmation - Order {order._id}"

    html_message = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <p>Hello {user.first_name},</p>

        <p>🎉 Thank you for shopping with us! Your order <strong>#{order._id}</strong> has been successfully placed.</p>

        <h3>Order Summary:</h3>
        <table style="border-collapse: collapse; width: 100%;">
            <thead>
                <tr style="background-color: #f5f5f5;">
                    <th style="text-align:left; padding: 8px;">Book</th>
                    <th style="text-align:left; padding: 8px;">Name</th>
                    <th style="text-align:left; padding: 8px;">Quantity</th>
                    <th style="text-align:left; padding: 8px;">Price</th>
                </tr>
            </thead>
            <tbody>
                {items_html}
            </tbody>
        </table>

        <p>
            Items Total Price: ₹{itemsPrice:.2f}<br>
            Shipping Price: ₹{shippingPrice:.2f}<br>
            Tax: ₹{taxPrice:.2f}<br>
            Discount Applied: ₹{discountAmount:.2f}<br>
            <strong>Total Amount Paid: ₹{order.totalPrice:.2f}</strong>
        </p>

        <h4>Shipping Address:</h4>
        <p>
            {shipping_address.address}<br>
            {shipping_address.city}, {shipping_address.postalCode}<br>
            {shipping_address.country}
        </p>

        <p><strong>Payment Method:</strong> {paymentMethod}</p>

        <p>We will notify you once your order is shipped and provide tracking information.</p>

        <p>If you have any questions, feel free to reply to this email or contact our support team.</p>

        <p>Thank you for choosing Your Bookstore!</p>

        <p>Best regards,<br>Vidhyarthi Mitram</p>
    </body>
    </html>
    """

    plain_message = strip_tags(html_message)  # fallback plain text

    recipient_email = user.email

    try:
        email = EmailMultiAlternatives(
            subject,
            plain_message,
            settings.DEFAULT_FROM_EMAIL,
            [recipient_email]
        )
        email.attach_alternative(html_message, "text/html")
        email.send()
    except Exception as e:
        print(f"Error sending email: {e}")

    serializer = OrderSerializer(order, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    user = request.user

    try:
        order = Order.objects.get(_id=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            return Response({'detail': 'Not authorized to view this order'}, status=status.HTTP_403_FORBIDDEN)
    except Order.DoesNotExist:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    order = Order.objects.get(_id=pk)
    order.isPaid = True
    order.paidAt = datetime.now()
    order.save()
    return Response('Order was paid')


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    order = Order.objects.get(_id=pk)
    order.isDelivered = True
    order.deliveredAt = datetime.now()
    order.save()
    return Response('Order was delivered')


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def user_shipping_address(request):
    user = request.user

    try:
        shipping = UserShippingAddress.objects.get(user=user)
    except UserShippingAddress.DoesNotExist:
        shipping = None

    if request.method == 'GET':
        if shipping:
            serializer = UserShippingAddressSerializer(shipping)
            return Response(serializer.data)
        return Response({})  # No saved address

    elif request.method == 'POST':
        data = request.data
        if shipping:
            serializer = UserShippingAddressSerializer(shipping, data=data)
        else:
            serializer = UserShippingAddressSerializer(data={**data, 'user': user.id})

        if serializer.is_valid():
            serializer.save()
            return Response({'detail': 'Address saved successfully'})
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
