# masterDummy/signals.py

from django.db.models.signals import *
from django.dispatch import receiver
from account.models import *
from .models import *
from django.db.models import Avg
        
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
        
@receiver(post_save, sender=Review)
@receiver(post_delete, sender=Review)
def update_product_rating(sender, instance, **kwargs):
    product = instance.product
    avg_rating = product.reviews.aggregate(Avg('rating'))['rating__avg']
    product.rating = avg_rating if avg_rating is not None else 0.0
    product.save()
