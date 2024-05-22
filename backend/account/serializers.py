from rest_framework import serializers
from .models import UserData, UserDetails, SellerProfile, BuyerProfile

class CommonFieldsSerializer( serializers.ModelSerializer):
    """
    A base serializer with common fields like 'password'.
    """
    class Meta:
        fields = '__all__'

class UserSerializer(CommonFieldsSerializer):
    is_buyer = serializers.BooleanField(required=True)
    is_seller = serializers.BooleanField(required=True)
    password = serializers.CharField(write_only=True)
    class Meta(CommonFieldsSerializer.Meta):
        model = UserData

    def validate(self, data):
        is_buyer = data.get('is_buyer')
        is_seller = data.get('is_seller')
        
        if is_buyer and is_seller:
            raise serializers.ValidationError("A user cannot be both a buyer and a seller simultaneously.")
        
        if is_buyer:
            # If the user is a buyer, set is_seller to False
            data['is_seller'] = False
        
        return data

    def create(self, validated_data):
        is_buyer = validated_data.pop('is_buyer', False)
        is_seller = validated_data.pop('is_seller', False)

        user = UserData.objects.create_user(**validated_data, is_buyer=is_buyer, is_seller=is_seller)
        return user

class UserSpecificDetailsSerializer(CommonFieldsSerializer):
    password = serializers.CharField(write_only=True)
    class Meta(CommonFieldsSerializer.Meta):
        model = UserData
    
class UserDetailsSerializer(CommonFieldsSerializer):
    class Meta(CommonFieldsSerializer.Meta):
        model = UserDetails

class ProfileSerializer(CommonFieldsSerializer):
    """
    A base serializer for profile models (SellerProfile and BuyerProfile).
    """
    pass

class SellerProfileSerializer(ProfileSerializer):

    class Meta(ProfileSerializer.Meta):
        model = SellerProfile

class BuyerProfileSerializer(ProfileSerializer):
    
    class Meta(ProfileSerializer.Meta):
        model = BuyerProfile

# In Django, a mixin is a way to reuse code across multiple classes by combining multiple inheritance. 
# Mixins are generally small pieces of functionality that can be added to different classes to extend their behavior. 
# They are used to promote code reuse and maintainability.