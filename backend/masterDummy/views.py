from .serializers import *
from rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from account.models import SellerProfile
from .models import Product
from rest_framework.permissions import BasePermission
from .models import Review
from django.db.models.signals import pre_save
from django.dispatch import receiver

class SellerProductUpload(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def perform_create(self, serializer):
        # Check if the authenticated user has a SellerProfile
        try:
            seller_profile = SellerProfile.objects.get(user=self.request.user)
        except SellerProfile.DoesNotExist:
            raise PermissionDenied("Only sellers can upload products.")
        
        # Automatically set the seller based on the authenticated user
        serializer.save(seller=self.request.user)

class SellerProductDetails(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def perform_update(self, serializer):
        # Check if the authenticated user has a SellerProfile
        try:
            seller_profile = SellerProfile.objects.get(user=self.request.user)
        except SellerProfile.DoesNotExist:
            raise PermissionDenied("Only sellers can update products.")
        
        # Automatically set the seller based on the authenticated user
        serializer.save(seller=self.request.user)

    def perform_destroy(self, instance):
        # Check if the authenticated user has a SellerProfile
        try:
            seller_profile = SellerProfile.objects.get(user=self.request.user)
        except SellerProfile.DoesNotExist:
            raise PermissionDenied("Only sellers can delete products.")
        
        # Delete the product
        instance.delete()


class CategoryDetail(generics.CreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Check if the authenticated user has a SellerProfile
        try:
            seller_profile = SellerProfile.objects.get(user=self.request.user)
        except SellerProfile.DoesNotExist:
            return Response({"error": "Only sellers can create categories."}, status=status.HTTP_403_FORBIDDEN)
        
        # If the user is a seller, proceed with category creation
        return super().post(request, *args, **kwargs)
    

class ProductList(generics.ListAPIView):
    permission_classes = []
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        categorized_data = {}

        for product_data in serializer.data:
            category_name = product_data['category_name']
            if category_name not in categorized_data:
                categorized_data[category_name] = []
            categorized_data[category_name].append(product_data)

        return Response(categorized_data)
    

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    
class SellerProductList(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer

    def get_queryset(self):
        # Retrieve products for the authenticated user (seller)
        queryset = Product.objects.filter(seller=self.request.user)

        # Check if the requested seller is the same as the authenticated user
        requested_seller = self.request.query_params.get('seller_id')
        if requested_seller and int(requested_seller) != self.request.user.id:
            raise PermissionDenied("You are not allowed to access products of other sellers.")

        return queryset

class SellerProductDetail(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            # Filter products based on the authenticated seller
            return Product.objects.filter(seller=user)
        return Product.objects.none()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.seller != request.user:
            raise PermissionDenied("You do not have permission to perform this action.")
        return super().update(request, *args, **kwargs)
    
    
class IsBuyerPermission(BasePermission):
    message = "Only buyers can create reviews."

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_buyer
    
class ReviewListCreateView(generics.ListCreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated, IsBuyerPermission]  # Only authenticated buyers can access this endpoint

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # Set the user field to the currently authenticated user

class ReviewListView(generics.ListAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer # Only authenticated buyers can access this endpoint


class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]
 

class OrderListView(APIView):
    def get(self, request):
        # Retrieve all orders from the database
        orders = Order.objects.all()
        # Serialize the orders
        serializer = OrderSerializer(orders, many=True)
        # Return the serialized data
        return Response(serializer.data)

    def post(self, request):
        # Deserialize the request data
        serializer = OrderSerializer(data=request.data, many=isinstance(request.data, list))
        # Validate the data
        if serializer.is_valid():
            # Save the validated data
            serializer.save()
            # Return a success response
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        # Return an error response if data is invalid
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class IsSellerPermission(BasePermission):
    message = "Only SELLERS can edit orders."

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_seller 
    

class OrderHandleBySellerListCreate(generics.ListCreateAPIView):
    serializer_class = OrderHandleBySellerSerializer
    permission_classes = [IsAuthenticated, IsSellerPermission]

    def get_queryset(self):
        return Order_Handle_By_Seller.objects.filter(seller_user=self.request.user)

    def create(self, request, *args, **kwargs):
        # Handle bulk creation
        is_bulk = isinstance(request.data, list)
        if is_bulk:
            serializer = self.get_serializer(data=request.data, many=True)
        else:
            serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            serializer.save(seller_user=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


            
class OrderHandleBySellerDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = OrderHandleBySellerSerializer
    permission_classes = [IsAuthenticated, IsSellerPermission]

    def get_queryset(self):
        return Order_Handle_By_Seller.objects.filter(seller_user=self.request.user)

    def perform_update(self, serializer):
        # Handle bulk update
        is_bulk = isinstance(self.request.data, list)
        if is_bulk:
            updated_orders = []
            for order_data in self.request.data:
                order_id = order_data.get('id')
                if not order_id:
                    return Response({"error": "Order ID is required for each order."}, status=status.HTTP_400_BAD_REQUEST)
                try:
                    order = Order_Handle_By_Seller.objects.get(id=order_id, seller_user=self.request.user)
                except Order_Handle_By_Seller.DoesNotExist:
                    return Response({"error": f"Order with ID {order_id} not found or not owned by you."}, status=status.HTTP_404_NOT_FOUND)
                for key, value in order_data.items():
                    setattr(order, key, value)
                order.save()
                updated_orders.append(OrderHandleBySellerSerializer(order).data)
            return Response(updated_orders, status=status.HTTP_200_OK)
        else:
            serializer.save(seller_user=self.request.user)

    def perform_destroy(self, instance):
        instance.delete()