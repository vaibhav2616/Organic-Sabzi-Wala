"""
OrderService — business logic for orders.
Handles local order creation + optional external sync via adapter.
"""
import logging
from api.models import Order, OrderItem, Product, Coupon
from .adapters import get_order_adapter

logger = logging.getLogger(__name__)


class OrderService:
    def __init__(self, adapter=None):
        self.adapter = adapter or get_order_adapter()

    def place_order(self, user, data):
        """
        Create a local order and optionally sync to external system.
        Returns (order, error_response) tuple. error_response is None on success.
        """
        payment_method = data.get('payment_method', 'COD')

        # === Payment Validation ===
        if payment_method == 'COD':
            if not getattr(user, 'is_phone_verified', False):
                return None, {
                    'success': False,
                    'user_msg': 'Verification Required for COD. Please verify your phone number via OTP.',
                    'action_required': 'VERIFY_OTP',
                    'status': 403,
                }

        elif payment_method == 'WALLET':
            total_price = data.get('total_price', 0)
            if user.wallet_balance < total_price:
                return None, {
                    'success': False,
                    'user_msg': 'Insufficient Wallet Balance',
                    'status': 400,
                }
            user.wallet_balance -= total_price
            user.save()

        # === Coupon Logic ===
        coupon_code = data.get('coupon_code')
        coupon = None
        discount_amount = 0.00

        if coupon_code:
            try:
                coupon = Coupon.objects.get(code=coupon_code, is_active=True)
                discount_amount = coupon.discount_amount
            except Coupon.DoesNotExist:
                pass

        # === Create Local Order ===
        order = Order.objects.create(
            user=user,
            total_price=data.get('total_price', 0),
            is_cod=(payment_method == 'COD'),
            is_otp_verified=user.is_phone_verified,
            delivery_name=data.get('delivery_name', ''),
            delivery_street=data.get('delivery_street', ''),
            delivery_city=data.get('delivery_city', ''),
            delivery_zip_code=data.get('delivery_zip_code', ''),
            coupon=coupon,
            discount_amount=discount_amount,
        )

        # === Process Items ===
        items_data = data.get('items', [])
        for item in items_data:
            product_id = item.get('product_id')
            qty = item.get('quantity', 1)
            price = item.get('price', 0)

            try:
                # Try by external_id first (for WC compatibility), then by local UUID
                product = self._resolve_product(product_id)
                if product:
                    OrderItem.objects.create(
                        order=order,
                        product=product,
                        quantity=qty,
                        price_at_purchase=price,
                    )
                else:
                    logger.warning(f"Product not found for ID {product_id}")
            except Exception as e:
                logger.error(f"Error processing item {item}: {e}")

        # === Sync to External System ===
        try:
            self.adapter.sync_order(order)
        except Exception as e:
            logger.error(f"External order sync failed: {e}")
            # Order is still saved locally — sync failure is non-blocking

        # === Handle Razorpay ===
        if payment_method == 'RAZORPAY':
            import uuid
            order.payment_provider = 'RAZORPAY'
            order.save()
            return order, {
                'success': True,
                'order_id': str(order.id),
                'payment_data': {
                    'id': f'pay_{uuid.uuid4().hex[:10]}',
                    'amount': float(order.total_price),
                },
                'status': 200,
            }

        return order, None

    def update_item_weight(self, order_id, product_id, actual_weight):
        """
        Picker updates item weight. Saves locally + syncs externally.
        Returns (success: bool, message: str).
        """
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return False, 'Order Not Found'

        product = self._resolve_product(product_id)
        if not product:
            return False, 'Product Not Found'

        # Sync externally (adapter handles WC or no-op for local)
        try:
            self.adapter.update_item_weight(order, product, actual_weight)
        except Exception as e:
            logger.error(f"External weight update failed: {e}")
            return False, str(e)

        return True, 'Weight updated successfully'

    def _resolve_product(self, product_id):
        """Resolve a product by external_id OR local UUID."""
        # Try external_id first (for WC-originated IDs from frontend)
        try:
            return Product.objects.get(external_id=str(product_id))
        except Product.DoesNotExist:
            pass

        # Try local UUID
        try:
            return Product.objects.get(id=product_id)
        except (Product.DoesNotExist, ValueError):
            pass

        return None
