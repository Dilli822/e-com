from django.conf import settings
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.db import models 
from account.models import SellerProfile, BuyerProfile, UserData
import uuid
from django.utils.html import strip_tags
from django.db.models.signals import pre_save,post_save
from django.dispatch import receiver
from django.utils import timezone
from django.core.mail import send_mail

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
    specifications = models.TextField(null=True, blank=True, default="")
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=1)  # New field for average rating
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
    username = models.CharField(max_length=125, default="", null=True, blank=True)
    # product_image = models.ImageField(upload_to='seller/product_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review of {self.product.name} by {self.user.username}"
    
    def save(self, *args, **kwargs):
        # Populate the username from UserData if it's not already set
        if not self.username:
            try:
                user_data = UserData.objects.get(id=self.user.id)
                self.username = user_data.username
            except UserData.DoesNotExist:
                # Handle case where UserData does not exist
                self.username = None
        
        super().save(*args, **kwargs)

class Cart(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart for {self.user.username}"

class CartItem(models.Model):
    pass 

class Order(models.Model):
    id = models.BigAutoField(primary_key=True)
    order_id = models.CharField(max_length=16, editable=False)
    
    product_name = models.TextField()
    product_description = models.TextField()
    product_price = models.TextField()
    product_category = models.TextField()
    product_category_name = models.TextField()
    product_total_units = models.TextField()
    product_units = models.TextField()
    product_total_price = models.TextField()

    buyer_id = models.CharField(max_length=255)
    buyer_delivery_address = models.CharField(max_length=255)
    buyer_full_name = models.CharField(max_length=255)
    buyer_email = models.CharField(max_length=125)
    
    seller_id = models.TextField(default=0, unique=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    delivery_fee = models.CharField(max_length=125)
    mode_of_payment = models.CharField(max_length=125, default="Cash on Delivery")
    
    order_placed_by_buyer = models.BooleanField(default=True)
    order_delivered = models.BooleanField(default=False)
    order_pending = models.BooleanField(default=True)
    order_shipped = models.BooleanField(default=False)
    total_order_items_counter = models.BigIntegerField(blank=True, null=True, default=0)
    
    def __str__(self):
        return f'Order {self.order_id} by {self.buyer_full_name}'

    class Meta:
        verbose_name = "Order"
        verbose_name_plural = "Orders"
    
    def save(self, *args, **kwargs):
        # Count the number of unique sellers and categories
        unique_sellers = set(map(int, self.seller_id.split(', ')))
        unique_categories = set(map(int, self.product_category.split(', ')))
        total_order_items_counter = len(unique_sellers) 
        
        # Update total_order_items_counter field
        self.total_order_items_counter = total_order_items_counter
        
        super().save(*args, **kwargs)
        
# Signal to generate a unique UUID for order_id before saving
@receiver(pre_save, sender=Order)
def generate_order_id(sender, instance, **kwargs):
    if not instance.order_id:
        instance.order_id = uuid.uuid4().hex

# @receiver(post_save, sender=Order)
# def send_order_confirmation_email(sender, instance, created, **kwargs):
#     if created:
#         subject = 'Order Confirmation'
#         # Render HTML email template
#         html_message = render_to_string('order_confirmation_email.html', {'buyer_full_name': instance.buyer_full_name, 'order_id': instance.order_id})
#         # Plain text version of the email (strip HTML tags)
#         plain_message = strip_tags(html_message)
#         sender_email = 'f25836105@gmail.com'  # Update with your sender email
#         recipient_email = instance.buyer_email
#         # Send email
#         send_mail(subject, plain_message, sender_email, [recipient_email], html_message=html_message)
        
class Order_For_Seller(models.Model):
    id = models.BigAutoField(primary_key=True)
    order_id = models.CharField(max_length=16, editable=False)
    
    product_name = models.TextField()
    product_description = models.TextField()
    product_price = models.TextField()
    product_category = models.TextField()
    product_category_name = models.TextField()
    product_total_units = models.TextField()
    product_units = models.TextField()
    product_total_price = models.TextField()

    buyer_id = models.CharField(max_length=255)
    buyer_delivery_address = models.CharField(max_length=255)
    buyer_full_name = models.CharField(max_length=255)
    buyer_email = models.CharField(max_length=125)
    
    seller_id = models.TextField(default=0, unique=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    delivery_fee = models.CharField(max_length=125)
    mode_of_payment = models.CharField(max_length=125, default="Cash on Delivery")
    
    order_placed_by_buyer = models.BooleanField(default=True)
    order_delivered = models.BooleanField(default=False)
    order_pending = models.BooleanField(default=True)
    order_shipped = models.BooleanField(default=False)
    order_cancelled_by_seller = models.BooleanField(default=False)
    total_order_items_counter = models.BigIntegerField(blank=True, null=True, default=0)  
    
    def __str__(self):
        return f'Order {self.order_id} by {self.buyer_full_name}'

    class Meta:
        verbose_name = "Order for Seller"
        verbose_name_plural = "Orders for Sellers"

# Signal to copy data from Order to Order_For_Seller based on seller_id
@receiver(post_save, sender=Order)
def copy_order_to_order_for_seller(sender, instance, created, **kwargs):
    if created:
        seller_ids = str(instance.seller_id).split(', ')
        product_names = str(instance.product_name).split(', ')
        product_descriptions = str(instance.product_description).split(', ')
        product_prices = str(instance.product_price).split(', ')
        product_categories = str(instance.product_category).split(', ')
        product_category_names = str(instance.product_category_name).split(', ')
        product_units = str(instance.product_units).split(', ')
        
        for i, seller_id in enumerate(seller_ids):
            Order_For_Seller.objects.create(
                order_id=instance.order_id,
                product_name=product_names[i].strip() if i < len(product_names) else '',
                product_description=product_descriptions[i].strip() if i < len(product_descriptions) else '',
                product_price=product_prices[i].strip() if i < len(product_prices) else '',
                product_category=product_categories[i].strip() if i < len(product_categories) else '',
                product_category_name=product_category_names[i].strip() if i < len(product_category_names) else '',
                product_units=product_units[i].strip() if i < len(product_units) else '',
                product_total_units=instance.product_total_units,
             
                product_total_price=instance.product_total_price,
                buyer_id=instance.buyer_id,
                buyer_delivery_address=instance.buyer_delivery_address,
                buyer_full_name=instance.buyer_full_name,
                buyer_email=instance.buyer_email,
                seller_id = seller_id.strip(),
                delivery_fee=instance.delivery_fee,
                mode_of_payment=instance.mode_of_payment,
                order_placed_by_buyer=instance.order_placed_by_buyer,
                order_delivered=instance.order_delivered,
                order_pending=instance.order_pending,
                order_shipped=instance.order_shipped,
                total_order_items_counter=instance.total_order_items_counter
            )

class OrderArchive(models.Model):
    id = models.BigAutoField(primary_key=True)
    order_id = models.CharField(max_length=16, editable=False)
    product_names = models.TextField(null=True, blank=True)
    product_descriptions = models.TextField(null=True, blank=True)
    product_prices = models.TextField(null=True, blank=True)
    product_categories = models.TextField(null=True, blank=True)
    product_category_names = models.TextField(null=True, blank=True)
    product_total_units = models.TextField(null=True, blank=True)
    product_units = models.TextField(null=True, blank=True)
    product_total_price = models.TextField(null=True, blank=True)

    buyer_id = models.CharField(max_length=2555, null=True, blank=True)
    buyer_delivery_address = models.CharField(max_length=255, null=True, blank=True)
    buyer_full_name = models.CharField(max_length=255, null=True, blank=True)
    buyer_email = models.CharField(max_length=125, null=True, blank=True)
    
    seller_id = models.TextField(default=0, unique=False)
    created_at = models.DateTimeField(auto_now_add=True,null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True,null=True, blank=True)

    delivery_fee = models.CharField(max_length=125,null=True, blank=True)
    mode_of_payment = models.CharField(max_length=125, default="Cash on Delivery")
    
    original_ordered_items_count = models.BigIntegerField(null=True, blank=True, default=0)
    
    order_placed_by_buyer = models.BooleanField(default=True)
    order_delivered = models.BooleanField(default=False)
    order_pending = models.BooleanField(default=True)
    order_shipped = models.BooleanField(default=False)

    def __str__(self):
        return f"Archived Order {self.order_id}"