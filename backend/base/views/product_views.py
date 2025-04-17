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
    class_param = request.query_params.get('class', '')  # Get the class filter

    # Start with a basic filter based on the keyword
    products = Product.objects.filter(name__icontains=keyword)

    # If a class filter is provided, filter by category
    if class_param:
        products = products.filter(category__icontains=class_param)  # Use 'category' instead of 'book_class'

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getProduct(request, pk):
    product=Product.objects.get(_id=pk)
    serializer=ProductSerializer(product,many=False)
    return Response(serializer.data) 