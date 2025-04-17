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

    products = Product.objects.filter(name__icontains=keyword)

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getProduct(request, pk):
    product=Product.objects.get(_id=pk)
    serializer=ProductSerializer(product,many=False)
    return Response(serializer.data) 