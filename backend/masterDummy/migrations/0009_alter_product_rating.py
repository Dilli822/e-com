# Generated by Django 5.0.6 on 2024-06-08 12:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('masterDummy', '0008_remove_product_ratings_product_rating'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='rating',
            field=models.DecimalField(decimal_places=1, default=1, max_digits=3),
        ),
    ]