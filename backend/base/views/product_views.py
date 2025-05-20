from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from base.models import Product, Review
from base.serializers import ProductSerializer
from rest_framework import status
from django.db.models import Q

@api_view(['GET', 'POST'])
def getProducts(request):
    if request.method == 'POST':
        # Logic for adding or creating products (not changed)
        pass

    elif request.method == 'GET':
        # Get filters from query parameters
        keyword = request.query_params.get('keyword', '')
        class_param = request.query_params.get('class', '')
        school_param = request.query_params.get('school', '')
        price_param = request.query_params.get('price', '')
        category_param = request.query_params.get('category', '')
        type_param = request.query_params.get('type', '')  # book / stationery / all or blank

        # Start with all products
        products = Product.objects.all()

        # Keyword search
        if keyword:
            products = products.filter(
                Q(name__icontains=keyword) |
                Q(description__icontains=keyword) |
                Q(category__icontains=keyword)
            )

        # Filter by type only if not empty or 'all'
        if type_param and type_param.lower() != 'all':
            products = products.filter(type=type_param)

        # Filters for books only
        # Filters for books only
        if type_param == 'book' or type_param == '':
            if class_param:
                products = products.filter(category__icontains=class_param)  # used category for class
            if school_param:
                products = products.filter(school__icontains=school_param)
            if category_param:
                products = products.filter(category__icontains=category_param)  # again category used

        # Filters for stationery only
        if type_param == 'stationery':
            if class_param or school_param or category_param:
                return Response(
                    {"error": "Stationery products do not support class, school, or category filters."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            brand_param = request.query_params.get('brand', '')
            material_param = request.query_params.get('material', '')
            color_param = request.query_params.get('color', '')

            if brand_param:
                products = products.filter(brand__icontains=brand_param)
            if material_param:
                products = products.filter(material__icontains=material_param)
            if color_param:
                products = products.filter(color__icontains=color_param)

        # Price filters
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
                return Response({'error': 'Invalid price range'}, status=status.HTTP_400_BAD_REQUEST)

        serialized_products = ProductSerializer(products, many=True)
        return Response(serialized_products.data)

@api_view(['GET'])
def getProduct(request, pk):
    try:
        product = Product.objects.get(_id=pk)
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user

    product = Product.objects.create(
        user=user,
        name='Sample Name',
        price=0,
        brand='Sample Brand',
        countInStock=0,
        category='Sample Category',
        description=''
    )

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    data = request.data
    product = Product.objects.get(_id=pk)

    product.name = data['name']
    product.price = data['price']
    product.brand = data['brand']
    product.countInStock = data['countInStock']
    product.category = data['category']
    product.description = data['description']

    product.save()

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    product = Product.objects.get(_id=pk)
    product.delete()
    return Response('Producted Deleted')

@api_view(['POST'])
def uploadImage(request):
    data = request.data

    product_id = data['product_id']
    product = Product.objects.get(_id=product_id)

    product.image = request.FILES.get('image')
    product.save()

    return Response('Image was uploaded')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    product = Product.objects.get(_id=pk)
    data = request.data

    # 1 - Review already exists
    alreadyExists = product.review_set.filter(user=user).exists()
    if alreadyExists:
        content = {'detail': 'Product already reviewed'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # 2 - No Rating or 0
    elif data['rating'] == 0:
        content = {'detail': 'Please select a rating'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # 3 - Create review
    else:
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=data['rating'],
            comment=data['comment'],
        )

        reviews = product.review_set.all()
        product.numReviews = len(reviews)

        total = 0
        for i in reviews:
            total += i.rating

        product.rating = total / len(reviews)
        product.save()

        return Response('Review Added')