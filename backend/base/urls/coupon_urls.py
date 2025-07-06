from django.urls import path
from base.views import coupon_views as views

urlpatterns = [
    path('active_coupons/', views.get_active_coupons, name='active-coupons'),
    path('apply_coupon/', views.apply_coupon, name='apply-coupon'),
    path('create_coupon/', views.create_coupon, name='create-coupon'),
]
