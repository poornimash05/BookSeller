from django.contrib import admin
from .models import *

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ['code', 'discount_type', 'discount_value', 'valid_from', 'valid_until', 'is_active']
    list_filter = ['discount_type', 'is_active']
    search_fields = ['code']

# Register your models here.
admin.site.register(Product)
admin.site.register(Review)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)
#admin.site.register(CouponAdmin)