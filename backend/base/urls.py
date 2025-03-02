from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, UserViewSet, signUp, 
    order_list, user_order_list, user_order_detail, get_products_by_category,
    MyTokenObtainPairView, CategoryViewSet
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'users', UserViewSet, basename='user')
router.register(r'categories', CategoryViewSet, basename='category')

urlpatterns = [
    path('', include(router.urls)),  # Includes product and user URLs for CRUD operations
    path('register', signUp, name='register'),  # Sign up (registration) endpoint
    path('login', MyTokenObtainPairView.as_view(), name='login'),  # Login (JWT token)
    path('orders', order_list, name='order-list'),  # Get all orders (admin only)
    path('orders/<int:user_id>', user_order_list, name='user-order-list'),  # Get orders for a specific user
    path('orders/<int:user_id>/<int:order_id>', user_order_detail, name='user-order-detail'),  # Get details of a specific order
    path('category/<int:category_id>', get_products_by_category, name='get_products_by_category'),  # Custom endpoint for getting products by category
]
