from django.urls import path
from base.views import order_views as views
from base.views.order_views import user_shipping_address  

urlpatterns=[
    
    path('add/', views.addOrderItems, name='orders-add'),
    path('<str:pk>/', views.getOrderById, name='user-order'),
    path('<str:pk>/pay/', views.updateOrderToPaid, name='pay'),
    path('api/user/shipping/', user_shipping_address, name='user-shipping-address'),
]