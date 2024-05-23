from rest_framework import serializers
from .models import *

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = '__all__'

class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'


# class OrderSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Order
#         fields = '__all__'
        
#         read_only_fields = ['order_id']  # Making order_id read-only as it's generated automatically

#     def create(self, validated_data):
#         # Generate the order_id based on the id of the Order model
#         order = Order.objects.create(**validated_data)
#         order.order_id = format(order.id, 'x').zfill(16)
#         order.save()
#         return order


# class OrderHandleBySellerSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Order_Handle_By_Seller
#         fields = '__all__'

#     def create(self, validated_data):
#         is_bulk = isinstance(validated_data, list)
#         if is_bulk:
#             orders = []
#             for data in validated_data:
#                 order = Order_Handle_By_Seller.objects.create(**data)
#                 orders.append(order)
#             return orders
#         else:
#             return super().create(validated_data)


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'
        
class OrderHandleBySellerSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Order_For_Seller
        fields = '__all__'