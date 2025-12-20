from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductListView, CheckDeliveryView, CartAddView, ProductProxyView,
    ProductListAPIView, ProductDetailAPIView, CategoryListAPIView,
)
from .views_auth import SendOTPView, VerifyOTPView, UserUpdateView
from .views_order import PlaceOrderView, PaymentWebhookView, OrderDetailView
from .views_history import OrderHistoryView
from .views_address import AddressViewSet
from .views_coupon import ApplyCouponView, CouponListView
from .views_root import api_root
from .views_subscription import SubscriptionViewSet
from .views_wishlist import WishlistViewSet
from .views_picker import PickerUpdateView

router = DefaultRouter()
router.register(r'addresses', AddressViewSet, basename='address')
router.register(r'subscriptions', SubscriptionViewSet, basename='subscription')
router.register(r'wishlist', WishlistViewSet, basename='wishlist')

urlpatterns = [
    path('', api_root, name='api-root'),
    path('', include(router.urls)), 

    # === NEW: Modular product/category endpoints (use these) ===
    path('v2/products/', ProductListAPIView.as_view(), name='product-list-v2'),
    path('v2/products/<str:identifier>/', ProductDetailAPIView.as_view(), name='product-detail-v2'),
    path('v2/categories/', CategoryListAPIView.as_view(), name='category-list-v2'),

    # === LEGACY: Keep for backward compatibility ===
    path('proxy/products/', ProductProxyView.as_view(), name='product-proxy'),
    path('products/', ProductListView.as_view(), name='product-list'),

    # === Core Endpoints ===
    path('check-delivery/', CheckDeliveryView.as_view(), name='check-delivery'),
    path('cart/add/', CartAddView.as_view(), name='cart-add'),
    path('auth/otp/send/', SendOTPView.as_view(), name='send-otp'),
    path('auth/otp/verify/', VerifyOTPView.as_view(), name='verify-otp'),
    path('auth/profile/', UserUpdateView.as_view(), name='user-profile-update'),
    path('orders/place/', PlaceOrderView.as_view(), name='place-order'),
    path('orders/<uuid:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('orders/history/', OrderHistoryView.as_view(), name='order-history'),
    path('payment/webhook/', PaymentWebhookView.as_view(), name='payment-webhook'),
    path('coupons/apply/', ApplyCouponView.as_view(), name='apply-coupon'),
    path('coupons/', CouponListView.as_view(), name='coupon-list'),
    
    # === Picker / Warehouse API ===
    path('picker/orders/<uuid:order_id>/update/', PickerUpdateView.as_view(), name='picker-update'),
]