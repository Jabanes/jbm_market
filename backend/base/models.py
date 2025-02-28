from django.db import models
from django.contrib.auth.models import User  # Import User model


class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name
    

class Product(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True,   blank=True)  
    name = models.CharField(max_length=50, null=True, blank=True)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    image = models.ImageField(null=True,blank=True,default='/placeholder.png')
    stock = models.DecimalField(max_digits=5, decimal_places=2)
    category = models.CharField(max_length=50, null=True, blank=True)
    

    def __str__(self):
        return self.name if self.name else "Unnamed Product"

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order_date = models.DateTimeField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20)

    class Meta:
        db_table = 'orders'  # Matches the 'orders' table in MySQL
        managed = False  # Prevent Django from creating or altering this table

    def __str__(self):
        return f"Order {self.id} - {self.user.username}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="order_items", on_delete=models.CASCADE)
    product_id = models.IntegerField()  # Use IntegerField for product_id, assuming it's a foreign key in MySQL
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'order_items'  # Matches the 'order_items' table in MySQL
        managed = False  # Prevent Django from creating or altering this table

    def __str__(self):
        return f"Order Item {self.id} - Order {self.order.id} - Product {self.product_id}"
    

