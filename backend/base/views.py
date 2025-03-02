from rest_framework import status, viewsets
from django.db import connection
from .models import User, Order, Category
from .serializers import ProductSerializer, UserSerializer, RegisterSerializer, CategorySerializer, OrderSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# Custom Token Serializer
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['first name'] = user.first_name
        token['last name'] = user.last_name
        token['email'] = user.email  # Add custom user data
        return token



class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

# Product ViewSet
class ProductViewSet(viewsets.ReadOnlyModelViewSet):  # ReadOnly since it's a view
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT product_id, product_name, price, stock, category_name
                FROM available_products_view;
            """)
            rows = cursor.fetchall()

        # Convert raw query results to a list of dictionaries
        products = [
            {
                "id": row[0],  # product_id from the view
                "name": row[1],  # product_name from the view
                "price": row[2],
                "stock": row[3],
                "category": row[4]
            }
            for row in rows
        ]

        return products

# User ViewSet
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

# Register (SignUp) View
@api_view(['POST'])
@permission_classes([AllowAny])
def signUp(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Login View using JWT
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# Get all orders (Admin only)
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def order_list(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

# Get all orders of a specific user
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_order_list(request, user_id):
    if request.user.id != user_id and not request.user.is_staff:
        return Response({"error": "You do not have permission to access this user's orders"}, status=403)

    with connection.cursor() as cursor:
        cursor.callproc('GetOrdersByUserId', [user_id])  # Call the stored procedure
        columns = [col[0] for col in cursor.description]  # Get column names
        orders = [dict(zip(columns, row)) for row in cursor.fetchall()]  # Convert results to a list of dictionaries

    return Response(orders)  # Return JSON response
# Get details of a specific order of a user
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_order_detail(request, user_id, order_id):
    if request.user.id != user_id and not request.user.is_staff:
        return Response({"error": "You do not have permission to access this order"}, status=403)

    try:
        with connection.cursor() as cursor:
            cursor.callproc('GetOrderDetails', [user_id, order_id])
            columns = [col[0] for col in cursor.description]  # Fetch column names
            results = [dict(zip(columns, row)) for row in cursor.fetchall()]  # Convert rows to dicts

        print(results)  # Debugging: Print the results to check the actual column names

        if not results:
            return Response({"error": "Order not found"}, status=404)

        # Extract order-level details (all rows should have the same order data)
        order_data = {
            "order_id": results[0]["order_id"],
            "user_id": results[0]["user_id"],
            "order_date": results[0]["order_date"],
            "items": []  # We'll fill this with the item-level data
        }

        # Extract item-level details for the order (multiple rows for the same order)
        for row in results:
            item_data = {
                "product_name": row["product_name"],
                "quantity": row["quantity"],
                "price_per_unit": row["price"],  # Updated from 'price_per_unit' to 'price'
                "total_product_amount": row["product_total_amount"],  # Updated from 'total_amount' to 'product_total_amount'
            }
            order_data["items"].append(item_data)

        return Response(order_data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import connection

@api_view(['GET'])
def get_products_by_category(request, category_id):
    # List to hold the products fetched from the stored procedure
    products = []
    
    # Use the cursor to call the stored procedure and fetch the results
    with connection.cursor() as cursor:
        # Call the stored procedure with the category_id
        cursor.callproc('GetProductsByCategory', [category_id])
        
        # Fetch all results from the cursor after calling the stored procedure
        results = cursor.fetchall()
        
        # If no results are found, return an empty list
        if not results:
            return Response(products)
        
        # Process each row returned by the stored procedure
        for row in results:
            product = {
                'product_id': row[0],  # Assuming these are the columns from the stored procedure's result
                'product_name': row[1],
                'price': row[2],
                'stock': row[3],
                'category_name': row[4],
            }
            products.append(product)
    
    # Return the products in the response
    return Response(products)
