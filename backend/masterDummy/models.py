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


class Order(models.Model):
    id = models.BigAutoField(primary_key=True)
    order_id = models.CharField(max_length=16, editable=False, default=uuid.uuid4().hex)
    
    buyer_id = models.BigIntegerField(default=0, unique=False)
    buyer_delivery_address = models.TextField(null=True, blank=True)
    buyer_contact = models.CharField(max_length=20, null=True, blank=True)
    buyer_full_name = models.CharField(max_length=255, null=True, blank=True)
    buyer_email = models.CharField(max_length=255, null=True, blank=True)
    
    product_name = models.TextField( blank=True)
    product_description = models.TextField(blank=True)
    product_price = models.TextField(default=0.00, blank=True)
    product_total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, blank=True)
    product_total_unit = models.BigIntegerField(blank=True, default=0)
    product_category = models.CharField(max_length=255, blank=True, default=0)
    product_category_name = models.TextField( blank=True)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, blank=True)
    mode_of_payment =  models.CharField(max_length=255, default="Cash on Delivery")

    # Timestamp fields
    created_at = models.DateTimeField(editable=False, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    
    seller_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sold_orders', null=True)
    seller_id = models.TextField(default=0, unique=False)
    order_delivered = models.BooleanField(default=False)
    order_shipped = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.order_id:
            # Check if the id is set, otherwise, save the instance to generate it
            if not self.id:
                super().save(*args, **kwargs)
            self.order_id = format(self.id, 'x').zfill(16)
        super().save(*args, **kwargs)
        
        # Check if an Order_Handle_By_Seller instance already exists for this order_id
        order_handle_by_seller, created = Order_Handle_By_Seller.objects.get_or_create(order_id=self.order_id)
        
        # Copy the fields from Order to Order_Handle_By_Seller
        order_handle_by_seller.order_id = self.order_id
        order_handle_by_seller.seller_id = self.seller_id
        order_handle_by_seller.buyer_id = self.buyer_id
        order_handle_by_seller.buyer_delivery_address = self.buyer_delivery_address
        order_handle_by_seller.buyer_contact = self.buyer_contact
        order_handle_by_seller.buyer_full_name = self.buyer_full_name
        order_handle_by_seller.buyer_email = self.buyer_email
        order_handle_by_seller.product_name = self.product_name
        order_handle_by_seller.product_description = self.product_description
        order_handle_by_seller.product_price = self.product_price
        order_handle_by_seller.product_total_price = self.product_total_price
        order_handle_by_seller.product_total_unit = self.product_total_unit
        order_handle_by_seller.product_category = self.product_category
        order_handle_by_seller.product_category_name = self.product_category_name
        order_handle_by_seller.delivery_fee = self.delivery_fee
        order_handle_by_seller.created_at = self.created_at
        order_handle_by_seller.updated_at = self.updated_at
        order_handle_by_seller.seller_user = self.seller_user
        order_handle_by_seller.order_delivered = self.order_delivered
        order_handle_by_seller.order_shipped = self.order_shipped
        order_handle_by_seller.mode_of_payment =  models.CharField(max_length=255, default="Cash on Delivery")
        
        # Save the Order_Handle_By_Seller instance
        order_handle_by_seller.save()

    def __str__(self):
        return f"Order {self.order_id} by {self.buyer_full_name}"

# Signal to set created_at field before saving the object
@receiver(pre_save, sender=Order)
def set_created_at(sender, instance, **kwargs):
    if not instance.created_at:
        instance.created_at = timezone.now()


class Order_Handle_By_Seller(models.Model):
    id = models.BigAutoField(primary_key=True)
    order_id = models.CharField(max_length=16, editable=False, default=uuid.uuid4().hex)
    
    buyer_id = models.BigIntegerField(default=0, unique=False)
    buyer_delivery_address = models.TextField(null=True, blank=True)
    buyer_contact = models.CharField(max_length=20, null=True, blank=True)
    buyer_full_name = models.CharField(max_length=255, null=True, blank=True)
    buyer_email = models.CharField(max_length=255, null=True, blank=True)
    
    product_name = models.CharField(max_length=255, blank=True)
    product_description = models.TextField(blank=True)
    product_price = models.TextField(default=0.00, blank=True)
    product_total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, blank=True)
    product_total_unit = models.BigIntegerField(blank=True, default=0)
    product_category = models.TextField(blank=True, default=0)
    product_category_name = models.TextField( blank=True)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, blank=True)
    mode_of_payment =  models.CharField(max_length=255, default="Cash on Delivery")
    # Timestamp fields
    created_at = models.DateTimeField(editable=False, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    
    seller_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='handled_orders', null=True)
    seller_id = models.TextField(default=0, unique=False)
    order_delivered = models.BooleanField(default=False)
    order_shipped = models.BooleanField(default=False)
    order_cancelled = models.BooleanField(default=False)
    
    order_returned = models.BooleanField(default=False)
    order_returned_reason = models.TextField(blank=True)
    order_returned_date = models.DateTimeField(auto_now=True, null=True)
    order_returned_fund = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, blank=True)
    
    
    def __str__(self):
        return f"Order Handle By Seller {self.order_id} by {self.buyer_full_name}"