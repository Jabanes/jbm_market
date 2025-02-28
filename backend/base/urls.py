from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, UserViewSet, signUp, 
    order_list, user_order_list, user_order_detail, 
    MyTokenObtainPairView
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),  
    path('register', signUp, name='register'),
    path('login', MyTokenObtainPairView.as_view(), name='login'),  
    path('orders', order_list, name='order-list'), 
    path('orders/<int:user_id>', user_order_list, name='user-order-list'),  
    path('orders/<int:user_id>/<int:order_id>', user_order_detail, name='user-order-detail'), 
]
