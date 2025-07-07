from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import (
    Product, ClassFilter, Order, OrderItem, ShippingAddress,
    Review, SchoolFilter, Coupon, UserShippingAddress
)

# -------------------------------
# User Serializers
# -------------------------------

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
        return obj.first_name if obj.first_name else obj.email


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin', 'token']

    def get_token(self, obj):
        refresh = RefreshToken.for_user(obj)
        return str(refresh.access_token)

    def get_token(self, obj):
        refresh = RefreshToken.for_user(obj)
        return str(refresh.access_token)

# -------------------------------
# Product & Review Serializers
# -------------------------------

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField(read_only=True)
    formatted_price = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()  # ✅ Override the image field

    class Meta:
        model = Product
        fields = '__all__'

    def get_reviews(self, obj):
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data

    def get_formatted_price(self, obj):
        try:
            return f"₹{float(obj.price):,.2f}" if obj.price else "₹0.00"
        except (ValueError, TypeError):
            return "₹0.00"

    def get_image(self, obj):  # ✅ This removes /static/images/ from the path
        return obj.image.name if obj.image else None

# -------------------------------
# Shipping Address Serializers
# -------------------------------

class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'


class UserShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserShippingAddress
        fields = '__all__'

# -------------------------------
# Order Serializers
# -------------------------------

class OrderItemSerializer(serializers.ModelSerializer):
    formatted_price = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = '__all__'

    def get_formatted_price(self, obj):
        try:
            return f"₹{float(obj.price):,.2f}" if obj.price else "₹0.00"
        except (ValueError, TypeError):
            return "₹0.00"


class OrderSerializer(serializers.ModelSerializer):
    orderItems = serializers.SerializerMethodField(read_only=True)
    shippingAddress = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)
    coupon = serializers.StringRelatedField()
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
            return ShippingAddressSerializer(obj.shippingaddress, many=False).data
        except:
            return None

    def get_user(self, obj):
        return UserSerializer(obj.user, many=False).data

    def get_formatted_items_price(self, obj):
        try:
            price = float(obj.get_cart_total()) if hasattr(obj, 'get_cart_total') else float(obj.totalPrice)
            return f"₹{price:,.2f}"
        except (ValueError, TypeError):
            return "₹0.00"

    def get_formatted_shipping_price(self, obj):
        try:
            return f"₹{float(obj.shippingPrice):,.2f}"
        except (ValueError, TypeError):
            return "₹0.00"

    def get_formatted_tax_price(self, obj):
        try:
            return f"₹{float(obj.taxPrice):,.2f}"
        except (ValueError, TypeError):
            return "₹0.00"

    def get_formatted_total_price(self, obj):
        try:
            return f"₹{float(obj.totalPrice):,.2f}"
        except (ValueError, TypeError):
            return "₹0.00"

# -------------------------------
# Coupon Serializer
# -------------------------------

class CouponSerializer(serializers.ModelSerializer):
    is_active = serializers.BooleanField()

    class Meta:
        model = Coupon
        fields = '__all__'
