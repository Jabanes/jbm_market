# Generated by Django 5.1.6 on 2025-02-27 13:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0003_order_orderitem'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='OrderItem',
            new_name='Order_Item',
        ),
    ]
