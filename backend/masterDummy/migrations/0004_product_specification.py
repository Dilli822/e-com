# Generated by Django 5.0.6 on 2024-06-03 00:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('masterDummy', '0003_order_for_seller_total_order_items_counter_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='specification',
            field=models.TextField(blank=True, null=True),
        ),
    ]
