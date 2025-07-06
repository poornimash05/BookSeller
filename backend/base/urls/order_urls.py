from django.urls import path
from base.views import order_views as views
from base.views.order_views import user_shipping_address  

urlpatterns=[
    path('', views.getOrders, name='orders'),
    path('add/', views.addOrderItems, name='orders-add'),
    path('myorders/', views.getMyOrders, name='myorders'),
    path('<str:pk>/deliver/', views.updateOrderToDelivered, name='order-delivered'),
    path('<str:pk>/', views.getOrderById, name='user-order'),
    path('<str:pk>/pay/', views.updateOrderToPaid, name='pay'),
    path('api/user/shipping/', user_shipping_address, name='user-shipping-address'),
    path('send-notification/', views.send_order_notification, name='send-order-notification'),
]