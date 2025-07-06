from django.contrib import admin
from .models import AdminPushNotification,Coupon, Product, Review, Order, OrderItem, ShippingAddress

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ['code', 'discount_type', 'discount_value', 'valid_from', 'valid_until', 'is_active']
    list_filter = ['discount_type', 'is_active']
    search_fields = ['code']

@admin.register(AdminPushNotification)
class AdminPushNotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'sent', 'created_at')

class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'type', 'price', 'countInStock', 'is_recommended']
    list_filter = ['type', 'school', 'category', 'brand']
    search_fields = ['name', 'school', 'category', 'brand']

admin.site.register(Product, ProductAdmin)
admin.site.register(Review)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)
