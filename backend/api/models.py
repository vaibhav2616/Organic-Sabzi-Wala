from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.utils.translation import gettext_lazy as _
import uuid

# User Model
class User(AbstractUser):
    ROLE_CHOICES = [
        ('CUSTOMER', 'Customer'),
        ('PICKER', 'Warehouse Picker'),
        ('DRIVER', 'Delivery Agent'),
        ('MANAGER', 'Manager'),
        ('ADMIN', 'Admin'),
    ]

    phone_number = models.CharField(max_length=15, unique=True)
    is_phone_verified = models.BooleanField(default=False)
    wallet_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='CUSTOMER')
    
    # Resolving conflicts with default User model
    groups = models.ManyToManyField(
        Group,
        verbose_name=_('groups'),
        blank=True,
        help_text=_(
            'The groups this user belongs to. A user will get all permissions '
            'granted to each of their groups.'
        ),
        related_name="custom_user_set",
        related_query_name="custom_user",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name=_('user permissions'),
        blank=True,
        help_text=_('Specific permissions for this user.'),
        related_name="custom_user_set",
        related_query_name="custom_user",
    )

    REQUIRED_FIELDS = ['phone_number']

    def __str__(self):
        return self.username

# Unit of Measure Model
class UnitOfMeasure(models.Model):
    name = models.CharField(max_length=50, unique=True, help_text="e.g. Kilogram, Gram, Piece, Bundle")
    symbol = models.CharField(max_length=10, unique=True, help_text="e.g. kg, g, pc")

    def __str__(self):
        return f"{self.name} ({self.symbol})"

# Category Model
class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    token_id = models.CharField(max_length=255, blank=True, null=True, help_text="Image URL or Icon Token")
    
    def __str__(self):
        return self.name

# Product Model
class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    
    # External System Mapping (vendor-agnostic)
    external_id = models.CharField(max_length=100, unique=True, null=True, blank=True, help_text="External system ID (WooCommerce, ERP, etc.)")
    external_source = models.CharField(max_length=50, blank=True, default='', help_text="Source system: 'woocommerce', 'custom_erp', etc.")

    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    discounted_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    
    # Pricing Unit: How we sell it (e.g. Per Piece, Per Kg)
    pricing_unit = models.ForeignKey(UnitOfMeasure, on_delete=models.PROTECT, related_name='products_priced_by')
    
    # Weight Unit: The actual weight/volume (e.g. 500g implies weight_value=500, weight_unit=g)
    # This is for "Lemon 1pc (approx 50g)"
    weight_value = models.DecimalField(max_digits=10, decimal_places=2, help_text="Approximate weight per pricing unit")
    weight_unit = models.ForeignKey(UnitOfMeasure, on_delete=models.PROTECT, related_name='products_weighted_by')
    
    is_organic = models.BooleanField(default=False, help_text="Shows Trust Ribbon if true")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

# Delivery Zone Model
class DeliveryZone(models.Model):
    zip_code = models.CharField(max_length=10, unique=True)
    city = models.CharField(max_length=100)
    delivery_time_hrs = models.PositiveIntegerField(help_text="Expected delivery time in hours")
    is_serviceable = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.zip_code} - {self.city} ({self.delivery_time_hrs}h)"

# Order Model
class Order(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    ]
    DELIVERY_STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('PACKING', 'Packing'),
        ('OUT_FOR_DELIVERY', 'Out for Delivery'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='PENDING')
    delivery_status = models.CharField(max_length=20, choices=DELIVERY_STATUS_CHOICES, default='PENDING')
    
    # External System Mapping (vendor-agnostic)
    external_order_id = models.CharField(max_length=100, blank=True, null=True, help_text="External system order ID")
    external_source = models.CharField(max_length=50, blank=True, default='', help_text="Source: 'woocommerce', 'custom_erp', etc.")

    is_cod = models.BooleanField(default=False)
    is_otp_verified = models.BooleanField(default=False, help_text="Required for COD orders")
    
    # Payment Fields
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    payment_provider = models.CharField(max_length=50, blank=True, null=True) # WALLET, RAZORPAY, etc.
    
    delivery_zone = models.ForeignKey(DeliveryZone, on_delete=models.SET_NULL, null=True)
    
    # Coupon & Discount
    coupon = models.ForeignKey('Coupon', on_delete=models.SET_NULL, null=True, blank=True)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    # Snapshot of Address at time of order
    delivery_name = models.CharField(max_length=255, blank=True)
    delivery_street = models.TextField(blank=True)
    delivery_city = models.CharField(max_length=100, blank=True)
    delivery_zip_code = models.CharField(max_length=20, blank=True)
    
    # Tracking & Subscription Fields
    is_subscription = models.BooleanField(default=False)
    driver_name = models.CharField(max_length=100, blank=True, null=True)
    driver_phone = models.CharField(max_length=15, blank=True, null=True)
    driver_location_lat = models.FloatField(blank=True, null=True)
    driver_location_lng = models.FloatField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order {self.id} - {self.user.username}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} in Order {self.order.id}"

# Address Model
class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    name = models.CharField(max_length=100, help_text="Receiver's Name")
    street = models.TextField()
    city = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=10)
    
    ADDRESS_TYPE_CHOICES = [
        ('HOME', 'Home'),
        ('WORK', 'Work'),
        ('OTHER', 'Other'),
    ]
    type = models.CharField(max_length=10, choices=ADDRESS_TYPE_CHOICES, default='HOME')
    is_default = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.is_default:
            # Set all other addresses of this user to not default
            Address.objects.filter(user=self.user).update(is_default=False)
        super().save(*args, **kwargs)

# Coupon Model
class Coupon(models.Model):
    code = models.CharField(max_length=20, unique=True)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="Flat discount amount in Rupees")
    min_order_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)
    valid_until = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.code} - ₹{self.discount_amount} OFF"

# Subscription Model
class Subscription(models.Model):
    FREQUENCY_CHOICES = [
        ('DAILY', 'Daily'),
        ('ALTERNATE_DAYS', 'Alternate Days (M/W/F)'),
        ('WEEKLY', 'Weekly'),
        ('MONTHLY', 'Monthly'),
    ]
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('PAUSED', 'Paused'),
        ('CANCELLED', 'Cancelled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, default='DAILY')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    
    start_date = models.DateField()
    next_delivery_date = models.DateField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.frequency} Subscription for {self.product.name} ({self.user.username})"

# Wishlist Model
class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"
