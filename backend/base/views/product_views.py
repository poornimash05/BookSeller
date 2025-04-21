from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from base.models import Product
from base.serializers import ProductSerializer
from rest_framework import status


from django.db.models import Q
@api_view(['GET'])
def getProducts(request):
    keyword = request.query_params.get('keyword', '')
    class_param = request.query_params.get('class', '')
    school_param = request.query_params.get('school', '')
    price_param = request.query_params.get('price', '')

    print(f"Class Param: {class_param}")  # Debug print

    products = Product.objects.all()

    if keyword:
        products = products.filter(
            Q(name__icontains=keyword) |
            Q(description__icontains=keyword) |
            Q(category__icontains=keyword)
        )

    # 🏷️ Class filter
    if class_param:
        products = products.filter(category__icontains=class_param)

    if school_param:
        products = products.filter(school__icontains=school_param)

    if price_param == 'low':
        products = products.order_by('price')
    elif price_param == 'high':
        products = products.order_by('-price')
    elif price_param == 'range':
        try:
            min_price = float(request.query_params.get('min_price', 0))
            max_price = float(request.query_params.get('max_price', 100000))
            products = products.filter(price__gte=min_price, price__lte=max_price)
        except ValueError:
            pass  # Or return Response({'error': 'Invalid price range'}, status=status.HTTP_400_BAD_REQUEST)


    print(f"Found {len(products)} products after filtering.")  # Debug print

    serialized_products = ProductSerializer(products, many=True)
    return Response(serialized_products.data)

@api_view(['GET'])
def getProduct(request, pk):
    product=Product.objects.get(_id=pk)
    serializer=ProductSerializer(product,many=False)
    return Response(serializer.data) 

