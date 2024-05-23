from django.conf import settings
from django.db import models 
from account.models import SellerProfile, BuyerProfile, UserData
import uuid
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils import timezone


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name
    
class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    category_name = models.CharField(max_length=200, blank=True, null=True, unique=False)  # Optional
    category_description = models.TextField(blank=True, null=True)  # Optional
    product_name = models.CharField(max_length=255, blank=True, null=True, unique=False, default="N/A")  # Optional
    
    description = models.TextField()
    discount = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.BigIntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='seller/product_images/', blank=True, null=True)
    
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='products')
    seller_name = models.CharField(max_length=100, blank=True, null=True)
    seller_bio = models.TextField(blank=True, null=True)
    seller_image = models.ImageField(upload_to='seller_images/', blank=True, null=True)
    seller_company_name = models.CharField(max_length=200, blank=True, null=True)
    seller_address = models.CharField(max_length=200, blank=True, null=True)
    seller_phone_number = models.CharField(max_length=20, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.category_id:
            try:
                # Retrieve the corresponding Category object based on category_id
                category_obj = Category.objects.get(id=self.category_id)
                # Populate category_name and category_description from the Category object
                self.category_name = category_obj.name
                self.category_description = category_obj.description
            except Category.DoesNotExist:
                pass
            
        if self.seller_id:
            try:
                seller_profile = SellerProfile.objects.get(user_id=self.seller_id)
                self.seller_name = seller_profile.user.username
                self.seller_bio = seller_profile.bio
                self.seller_image = seller_profile.image
                self.seller_company_name = seller_profile.company_name
                self.seller_address = seller_profile.address
                self.seller_phone_number = seller_profile.phone_number
            except SellerProfile.DoesNotExist:
                # Handle case where seller profile does not exist
                pass
        super().save(*args, **kwargs)

class Review(models.Model):
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review of {self.product.name} by {self.user.username}"

class Cart(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart for {self.user.username}"

class CartItem(models.Model):
    pass 

def generate_hex_uuid():
    return uuid.uuid4().hex


# class Order(models.Model):
#     id = models.BigAutoField(primary_key=True)
#     order_id = models.CharField(max_length=16, editable=False, default=uuid.uuid4().hex)
#     product_name = models.TextField( blank=True)
#     product_description = models.TextField(blank=True)
#     product_price = models.TextField(default=0.00, blank=True)
#     product_category = models.CharField(max_length=255, blank=True, default=0)
#     product_category_name = models.TextField( blank=True)
#     seller_id = models.TextField(default=0, unique=False)

    



# class Order_For_Seller(models.Model):
#     id = models.BigAutoField(primary_key=True)
#     order_id = models.CharField(max_length=16, editable=False, default=uuid.uuid4().hex)
#     product_name = models.TextField( blank=True)
#     product_description = models.TextField(blank=True)
#     product_price = models.TextField(default=0.00, blank=True)
#     product_category = models.CharField(max_length=255, blank=True, default=0)
#     product_category_name = models.TextField( blank=True)
#     seller_id = models.TextField(default=0, unique=False)

from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

class Order(models.Model):
    id = models.BigAutoField(primary_key=True)
    order_id = models.BigIntegerField(editable=False, null=True)
    product_name = models.TextField(blank=True)
    product_description = models.TextField(blank=True)
    product_price = models.TextField(blank=True)
    product_category = models.TextField(blank=True, default=0)
    product_category_name = models.TextField(blank=True)
    seller_id = models.TextField(default=0, unique=False)

class Order_For_Seller(models.Model):
    id = models.BigAutoField(primary_key=True)
    order_id = models.BigIntegerField(editable=False, null=True)
    product_name = models.TextField(blank=True)
    product_description = models.TextField(blank=True)
    product_price = models.TextField(blank=True)
    product_category = models.TextField(blank=True, default=0)
    product_category_name = models.TextField(blank=True)
    seller_id = models.TextField(default=0, unique=False)

# Signal to copy data from Order to Order_For_Seller based on seller_id
@receiver(post_save, sender=Order)
def copy_order_to_order_for_seller(sender, instance, created, **kwargs):
    if created:
        # Split seller_id if there are multiple ids
        seller_ids = str(instance.seller_id).split(', ')
        product_names = str(instance.product_name).split(', ')
        product_descriptions = str(instance.product_description).split(', ')
        product_prices = str(instance.product_price).split(', ')
        product_categories = str(instance.product_category).split(', ')
        product_category_names = str(instance.product_category_name).split(', ')
        
        for i, seller_id in enumerate(seller_ids):
            Order_For_Seller.objects.create(
                order_id=instance.order_id,
                product_name=product_names[i].strip(),
                product_description=product_descriptions[i].strip(),
                product_price=product_prices[i].strip(),
                product_category=product_categories[i].strip(),
                product_category_name=product_category_names[i].strip(),
                seller_id=seller_id.strip()
            )
