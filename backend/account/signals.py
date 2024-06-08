# account/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from masterDummy.models import Product
from .models import SellerProfile

@receiver(post_save, sender=SellerProfile)
def update_product_seller_info(sender, instance, **kwargs):
    products = Product.objects.filter(seller_id=instance.user.id)
    for product in products:
        product.seller_name = instance.user.username
        product.seller_bio = instance.bio
        product.seller_image = instance.image
        product.seller_company_name = instance.company_name
        product.seller_address = instance.address
        product.seller_phone_number = instance.phone_number
        product.save()
