
from django.urls import path, re_path
from . import views 
from .views import *

urlpatterns = [
    path('categories/', CategoryDetail.as_view(), name='category-list'),
    path('categories/list/', CategoryListView.as_view(), name='category-list'),
    path('products/public/list/', views.ProductList.as_view(), name='seller-product-list'),
    
    re_path(r'^e-com/api/products/public/list/(?P<category>[\w\s]+)/$', views.ProductPayLoadList.as_view(), name='ProductPayLoadList'),

    # All authenticated seller can upload the products
    path('products/upload/', views.SellerProductUpload.as_view(), name='seller-product-upload'),
    # path('products/edit/<int:pk>/', views.SellerProductDetails.as_view(), name='seller-product-edit'),
    
    # For Specific Seller
    path('seller/products/edit/<int:pk>/', SellerProductDetail.as_view(), name='seller-product-detail'),
    path('seller/products/list/', SellerProductList.as_view(), name='seller_product_list'),
    
    
    path('reviews/', ReviewListView.as_view(), name='review-list-create'),
    path('reviews/create/', ReviewListCreateView.as_view(), name='review-detail'),
    # MUST SEND THE USER ID INT:PK
    path('reviews/edit/<int:pk>/', ReviewDetailView.as_view(), name='review-detail'),
    
    # Endpoint for listing and Creating orders
    path('orders/', OrderListView.as_view(), name='order-list-create'),
    #     path('orders/list/',   BuyerOrderList.as_view(), name='buyer-order-list'),

    # # SELLER HANDLING THE ORDERS FOR THEMSELVES
    path('sellers/orders/', SellerOrderListView.as_view(), name='order-list-create'),
    path('sellers/orders/edit/bulk/', SellerOrderBulkUpdateDeleteView.as_view(), name='order-bulk'),
    path('trigger_extraction/', trigger_extraction, name='trigger_extraction'),
    path('buyer/orders/final-archive/', UserOrderArchiveListView.as_view(), name='user-order-archive'),
]
