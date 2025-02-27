from rest_framework import serializers
from .models import Product, User, OrderItem, Order
from rest_framework.authtoken.models import Token


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__' 

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'is_staff', 'is_active']  # Choose fields you want to expose

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)


    class Meta:
        model = User
        fields = ['username', 'email', 'password']


    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user



# Login Serializer (just for token generation)
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)  # Nested serializer for product

    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'product', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # String representation of user (e.g., username)
    order_items = OrderItemSerializer(many=True, read_only=True)  # Nested order items

    class Meta:
        model = Order
        fields = ['id', 'user', 'order_date', 'total_amount', 'status', 'order_items']

