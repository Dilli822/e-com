from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.text import slugify
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    use_in_migration = True

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is Required')
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff = True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser = True')

        return self.create_user(email, password, **extra_fields)


class UserData(AbstractUser):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(max_length=100, unique=True)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    
    date_joined = models.DateTimeField(auto_now_add=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_buyer = models.BooleanField(default=False)
    is_seller = models.BooleanField(default=False)
    
    objects = UserManager()
    

    def save(self, *args, **kwargs):
        if not (self.is_buyer or self.is_seller or self.is_admin):
            raise ValidationError("At least one of 'is_buyer', 'is_seller', or 'is_admin' must be True")
        
        super().save(*args, **kwargs)
                
        if self.is_buyer:
            try:
                BuyerProfile.objects.get(user=self)
            except BuyerProfile.DoesNotExist:
                BuyerProfile.objects.create(user=self)

        elif self.is_seller:
            try:
                SellerProfile.objects.get(user=self)
            except SellerProfile.DoesNotExist:
                SellerProfile.objects.create(user=self)
                
                
        try:
            user_details = UserDetails.objects.get(user=self)
        except UserDetails.DoesNotExist:
            user_details = UserDetails(user=self)
            
        user_details.is_buyer = self.is_buyer
        user_details.is_seller = self.is_seller
        user_details.save()
    
    
    def delete(self, using=None, keep_parents=False):
        # Attempt to delete user_details, if it exists
        try:
            self.user_details.delete()
        except ObjectDoesNotExist:
            pass  # user_details does not exist, continue with deletion

        super().delete(using=using, keep_parents=keep_parents)
        
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username

class UserDetails(models.Model):
    user = models.OneToOneField('UserData', on_delete=models.CASCADE, related_name='user_details')
    is_buyer = models.BooleanField(default=False)
    is_seller = models.BooleanField(default=False)
    
    password_reset_token = models.CharField(max_length=100, blank=True, null=True)
    password_reset_token_generated_time = models.DateTimeField(blank=True, null=True) 
    password_reset_token_expire = models.DateTimeField(blank=True, null=True)


    def clean(self):
        if not self.is_buyer and not self.is_seller:
            raise ValidationError(_('At least one of "is_buyer" or "is_seller" must be True.'))

    def save(self, *args, **kwargs):
        self.clean()  # Ensure at least one of is_buyer or is_seller is True
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Details for {self.user.username}"


class SellerProfile(models.Model):
    user = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name='seller_profiles')
    seller_id = models.AutoField(primary_key=True, unique=True)
    
    bio = models.TextField(blank=True)
    image = models.ImageField(upload_to='seller/profile_images/', null=True, blank=True)
    company_name = models.CharField(max_length=100, blank=True)
    address = models.CharField(max_length=100, blank=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)


    def save(self, *args, **kwargs):
        if not self.seller_id:
            # Set seller_id to user's id if is_seller flag is set
            self.seller_id = 0 if not self.user.is_seller else self.user.id

        super().save(*args, **kwargs)

class BuyerProfile(models.Model):
    user = models.OneToOneField(UserData, on_delete=models.CASCADE, related_name='buyer_profile')
    buyer_id = models.AutoField(primary_key=True, unique=True)

    bio = models.TextField(blank=True)
    image = models.ImageField(upload_to='user/profile_images/', null=True, blank=True)
    address = models.CharField(max_length=100, blank=True)
    phone_number = phone_number = models.CharField(max_length=20, blank=True, null=True)
    
    def save(self, *args, **kwargs):
        if not self.buyer_id:
            # Set buyer_id to user's id if is_buyer flag is set
            self.buyer_id = 0 if not self.user.is_buyer else self.user.id
        super().save(*args, **kwargs)
