from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Product, ClassFilter, Order, OrderItem, ShippingAddress, Review, SchoolFilter
from .models import UserShippingAddress


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin']

    def get__id(self, obj):
        return obj.id

    def get_isAdmin(self, obj):
        return obj.is_staff

    def get_name(self, obj):
        name = obj.first_name
        if name == '':
            name = obj.email

        return name

class UserShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserShippingAddress
        fields = '__all__'

class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField(read_only=True)
    formatted_price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'
        extra_fields = ['formatted_price']

    def get_reviews(self, obj):
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data

    def get_formatted_price(self, obj):
        return f"₹{obj.price:,.2f}" if obj.price else "₹0.00"


class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    formatted_price = serializers.SerializerMethodField()
    class Meta:
        model = OrderItem
        fields = '__all__'

    def get_formatted_price(self, obj):
        return f"₹{obj.price:,.2f}" if obj.price else "₹0.00"


class OrderSerializer(serializers.ModelSerializer):
    orderItems = serializers.SerializerMethodField(read_only=True)
    shippingAddress = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)

    formatted_items_price = serializers.SerializerMethodField()
    formatted_shipping_price = serializers.SerializerMethodField()
    formatted_tax_price = serializers.SerializerMethodField()
    formatted_total_price = serializers.SerializerMethodField()
    class Meta:
        model = Order
        fields = '__all__'

    def get_orderItems(self, obj):
        items = obj.orderitem_set.all()
        serializer = OrderItemSerializer(items, many=True)
        return serializer.data

    def get_shippingAddress(self, obj):
        try:
            address = ShippingAddressSerializer(
                obj.shippingaddress, many=False).data
        except:
            address = False
        return address

    def get_user(self, obj):
        user = obj.user
        serializer = UserSerializer(user, many=False)
        return serializer.data

    def get_formatted_items_price(self, obj):
        return f"₹{obj.get_cart_total():,.2f}" if hasattr(obj, 'get_cart_total') else f"₹{obj.totalPrice:,.2f}"

    def get_formatted_shipping_price(self, obj):
        return f"₹{obj.shippingPrice:,.2f}" if obj.shippingPrice else "₹0.00"

    def get_formatted_tax_price(self, obj):
        return f"₹{obj.taxPrice:,.2f}" if obj.taxPrice else "₹0.00"

    def get_formatted_total_price(self, obj):
        return f"₹{obj.totalPrice:,.2f}" if obj.totalPrice else "₹0.00"
