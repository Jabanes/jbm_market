# Generated by Django 5.1.6 on 2025-02-27 17:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0005_orderitem_alter_order_options_delete_order_item'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomerOrdersView',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order_id', models.IntegerField()),
                ('user_id', models.IntegerField()),
                ('order_date', models.DateTimeField()),
                ('total_amount', models.DecimalField(decimal_places=2, max_digits=10)),
            ],
            options={
                'db_table': 'customer_orders_view',
                'managed': False,
            },
        ),
    ]
