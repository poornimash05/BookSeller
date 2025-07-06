from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from base.models import Coupon
from base.serializers import CouponSerializer
from datetime import datetime
from rest_framework import status
from django.http import JsonResponse
from django.utils import timezone

@api_view(['GET'])

def get_active_coupons(request):
    print("Fetching active coupons...")
    active_coupons = Coupon.objects.filter(is_active=True)
    print(f"Active Coupons: {active_coupons}")
    coupons_data = list(active_coupons.values())
    return JsonResponse(coupons_data, safe=False)

@api_view(['POST'])
@permission_classes([AllowAny])
def apply_coupon(request):
    cart_total = float(request.data.get('cart_total', 0))
    code = request.data.get('coupon_code')

    try:
        coupon = Coupon.objects.get(code=code, is_active=True)
        
        # Make sure 'now' is timezone-aware
        now = timezone.now()
        
        # Ensure both coupon's datetime fields are timezone-aware
        if coupon.valid_from and coupon.valid_until:
            if not coupon.valid_from.tzinfo:
                coupon.valid_from = timezone.make_aware(coupon.valid_from)
            if not coupon.valid_until.tzinfo:
                coupon.valid_until = timezone.make_aware(coupon.valid_until)

        # Perform the comparison now that both are timezone-aware
        if coupon.valid_from <= now <= coupon.valid_until:
            if coupon.discount_type == 'percentage':
                discount = cart_total * (float(coupon.discount_value) / 100)
            else:
                discount = float(coupon.discount_value)
            new_total = max(cart_total - discount, 0)
            return Response({'discount': round(discount, 2), 'new_total': round(new_total, 2)})
        
        return Response({'error': 'Coupon expired or inactive'}, status=status.HTTP_400_BAD_REQUEST)
    
    except Coupon.DoesNotExist:
        return Response({'error': 'Invalid coupon code'}, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['POST'])
@permission_classes([IsAdminUser])  # Only admin users can create coupons
def create_coupon(request):
    # Extract coupon data from the request
    code = request.data.get('code')
    discount_value = request.data.get('discount_value')
    discount_type = request.data.get('discount_type')
    is_active = request.data.get('is_active', True)
    valid_from = request.data.get('valid_from')  # Expecting a datetime in string format
    valid_until = request.data.get('valid_until')  # Expecting a datetime in string format
    
    # Ensure all required fields are provided
    if not all([code, discount_value, discount_type, valid_from, valid_until]):
        return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Convert valid_from and valid_until to datetime
        valid_from = datetime.strptime(valid_from, "%Y-%m-%dT%H:%M:%S")
        valid_until = datetime.strptime(valid_until, "%Y-%m-%dT%H:%M:%S")
        
        # Create a new coupon
        coupon = Coupon.objects.create(
            code=code,
            discount_value=discount_value,
            discount_type=discount_type,
            is_active=is_active,
            valid_from=valid_from,
            valid_until=valid_until
        )

        # Serialize the coupon data and return the response
        serializer = CouponSerializer(coupon)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
