from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/register/', RegisterView.as_view(), name="sign_up"),
    path('auth/usersList/', UserList.as_view(), name="get_users"),
    
    # user account CRUD
    path('user/delete/<int:pk>/', UserDeleteAPIView.as_view(), name='user-delete'),  #delete the whole username account
    path('user/details/',SpecificUserDetails.as_view(), name='user specific details' ) ,  # user specific details
    
    # password-reset
    path('password-reset-email/', EmailCheckAPIView.as_view(), name='send_email'),
    path('update-password/', PasswordUpdateAPIView.as_view(), name='password_update'),

    path('buyer-profile/<int:pk>/', BuyerProfileDetailAPIView.as_view(), name='buyer_profile_detail'),
    path('seller-profile/<int:pk>/', SellerProfileDetailAPIView.as_view(), name='buyer_profile_detail'),
    path('user/profile/', CombinedProfileAPIView.as_view(), name='combined-profile'),

]
