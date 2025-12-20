from rest_framework import serializers
from .models import Product, UnitOfMeasure, DeliveryZone, Order, OrderItem, User, Address, Subscription, Wishlist, Coupon

# ... classes ...



class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'name', 'street', 'city', 'zip_code', 'type', 'is_default']
        read_only_fields = ['id']

class UnitOfMeasureSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnitOfMeasure
        fields = ['id', 'name', 'symbol']

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'email']

class ProductSerializer(serializers.ModelSerializer):
    pricing_unit = UnitOfMeasureSerializer(read_only=True)
    weight_unit = UnitOfMeasureSerializer(read_only=True)
    trust_badge = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'image',
            'base_price', 'discounted_price',
            'pricing_unit', 'weight_value', 'weight_unit',
            'is_organic', 'trust_badge', 'is_active'
        ]

    def get_trust_badge(self, obj):
        return "Certified Organic" if obj.is_organic else None

class CartAddSerializer(serializers.Serializer):
    product_id = serializers.UUIDField()
    quantity = serializers.FloatField()

    def validate(self, data):
        try:
            product = Product.objects.get(id=data['product_id'])
        except Product.DoesNotExist:
            raise serializers.ValidationError("Product not found.")
        
        # LEMON FIX: If pricing unit is 'Piece' or 'pc', quantity must be Integer
        # We check the symbol or name of the text. Assuming 'pc' or 'Piece'
        unit_symbol = product.pricing_unit.symbol.lower()
        if unit_symbol in ['pc', 'piece', 'unit']:
            if not data['quantity'].is_integer():
                raise serializers.ValidationError({
                    'quantity': f"Item '{product.name}' is sold per piece. You cannot buy fractional amounts."
                })
        
        data['product'] = product
        return data

class DeliveryZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryZone
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = OrderItem
        fields = ['product', 'product_name', 'quantity', 'price_at_purchase']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'items', 'total_price',
            'payment_status', 'delivery_status',
            'is_cod', 'is_otp_verified', 'delivery_zone',
            'delivery_name', 'delivery_street', 'delivery_city', 'delivery_zip_code',
            'driver_name', 'driver_phone', 'driver_location_lat', 'driver_location_lng',
            'created_at'
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Privacy: Hide driver info unless Out for Delivery
        if instance.delivery_status != 'OUT_FOR_DELIVERY':
            data.pop('driver_name', None)
            data.pop('driver_phone', None)
            data.pop('driver_location_lat', None)
            data.pop('driver_location_lng', None)
        return data





class SubscriptionSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = Subscription
        fields = [
            'id', 'user', 'product', 'product_details', 'quantity',
            'frequency', 'status', 'start_date', 'next_delivery_date',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'user', 'next_delivery_date']

class WishlistSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'product', 'product_details', 'created_at']
        read_only_fields = ['id', 'created_at', 'user']

class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ['id', 'code', 'discount_amount', 'min_order_value', 'valid_until', 'is_active']
