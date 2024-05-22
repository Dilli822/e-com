from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView, RetrieveAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView, RetrieveUpdateAPIView
from .models import UserManager, UserData, UserDetails, BuyerProfile, SellerProfile

from django.shortcuts import get_object_or_404
from rest_framework import status
from django.core.mail import send_mail
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from rest_framework import status
from .serializers import *
from .utils import *  # Import the send_email_view function

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class UserDetailsListAPIView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserDetailsSerializer

    def get_queryset(self):
        return UserDetails.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        

class UserList(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_queryset(self):
        return UserData.objects.all()

    def perform_create(self, serializer):
        serializer.save()
        
        
class UserDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        user = request.user
        user.delete()  # This will delete the user and cascade to related models

        return Response({"message": "Account deleted successfully."})
    

class SpecificUserDetails(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSpecificDetailsSerializer

    def get_object(self):
        # Retrieve UserDetails for the authenticated user
        return self.request.user  # Directly return the authenticated user object

    def update(self, request, *args, **kwargs):
        # Ensure the user field is set to the authenticated user's id
        request.data['user'] = self.request.user.id

        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)
    
class EmailCheckAPIView(APIView):
    def post(self, request):
        email = request.data.get('email', None)
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the email exists in the database
        if UserData.objects.filter(email=email).exists():
            # Email exists in the database
            send_email_view(request, email)  # Call the send_email_view function with the email argument
            return Response({"message": "You will receive an email shortly."}, status=status.HTTP_200_OK)
        else:
            # Email does not exist in the database
            return Response({"message": "Email not found in the database."}, status=status.HTTP_404_NOT_FOUND)

class PasswordUpdateAPIView(APIView):
    def post(self, request):
        token = request.data.get('token', None)
        new_password = request.data.get('new_password', None)

        # Check if token and new password are provided
        if not token or not new_password:
            return Response({"error": "Token and new password are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Get UserDetails object for the given token
        try:
            user_details = UserDetails.objects.get(password_reset_token=token)
        except UserDetails.DoesNotExist:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the token is expired
        if user_details.password_reset_token_expire < timezone.now():
            return Response({"error": "Token has expired"}, status=status.HTTP_400_BAD_REQUEST)

        # Update user's password
        user = user_details.user
        user.set_password(new_password)
        user.save()

        return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)

class IsAdminUser(IsAuthenticated):
    """
    Custom permission class to allow access only to admin users.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_admin

class AdminUserListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get(self, request):
        users = UserData.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class AdminUserDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request, user_id):
        try:
            user = UserData.objects.get(pk=user_id)
        except UserData.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def delete(self, request, user_id):
        try:
            user = UserData.objects.get(pk=user_id)
        except UserData.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class BuyerProfileDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return BuyerProfile.objects.get(pk=pk)
        except BuyerProfile.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        buyer_profile = self.get_object(pk)
        serializer = BuyerProfileSerializer(buyer_profile)
        return Response(serializer.data)

    def put(self, request, pk):
        buyer_profile = self.get_object(pk)
        # Check if the user is the owner of the buyer profile
        if buyer_profile.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        serializer = BuyerProfileSerializer(buyer_profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        buyer_profile = self.get_object(pk)
        # Check if the user is the owner of the buyer profile
        if buyer_profile.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        buyer_profile.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
class SellerProfileDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return SellerProfile.objects.get(pk=pk)
        except SellerProfile.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        seller_profile = self.get_object(pk)
        serializer = SellerProfileSerializer(seller_profile)
        return Response(serializer.data)

    def put(self, request, pk):
        seller_profile = self.get_object(pk)
        # Check if the user is the owner of the buyer profile
        if seller_profile.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        serializer = SellerProfileSerializer(seller_profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        seller_profile = self.get_object(pk)
        # Check if the user is the owner of the buyer profile
        if seller_profile.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        seller_profile.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class CombinedProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if hasattr(user, 'buyer_profile'):
            buyer_profile = user.buyer_profile
            buyer_serializer = BuyerProfileSerializer(buyer_profile)
            combined_data = {
                'buyer': buyer_serializer.data,
                'user': UserSerializer(user).data
            }
        elif hasattr(user, 'seller_profiles'):
            seller_profiles = user.seller_profiles.all()
            seller_serializer = SellerProfileSerializer(seller_profiles, many=True)
            combined_data = {
                'sellers': seller_serializer.data,
                'user': UserSerializer(user).data
            }
        else:
            return Response({'error': 'User does not have a buyer or seller profile.'}, status=400)

        return Response(combined_data)