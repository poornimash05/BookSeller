from django.urls import path
from base.views import user_views as views
from base.views.user_views import save_fcm_token 

urlpatterns = [
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', views.registerUser, name='register'),
    path('profile/', views.getUserProfile, name="users-profile"),
    path('profile/update/', views.updateUserProfile, name="users-profile-update"),
    path('save-token/', views.save_fcm_token, name='save-fcm-token'),  # 👈 Moved above
    path('', views.getUsers, name="users"),
    path('update/<str:pk>/', views.updateUser, name='user-update'),
    path('delete/<str:pk>/', views.deleteUser, name='user-delete'),
    path('<str:pk>/', views.getUserById, name='user'),  # 👈 This must stay last
]
