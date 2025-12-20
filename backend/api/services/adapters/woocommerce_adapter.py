"""
WooCommerce Adapter — encapsulates ALL WooCommerce API calls.
When you leave WooCommerce, this file becomes dead code (just delete it).
"""
import requests
import logging
from django.conf import settings
from .base import BaseProductAdapter, BaseOrderAdapter
from api.models import Product, Category

logger = logging.getLogger(__name__)


def _wc_auth():
    """Return WooCommerce auth tuple."""
    return (settings.WC_CONSUMER_KEY, settings.WC_CONSUMER_SECRET)


def _wc_url(endpoint):
    """Build full WooCommerce API URL."""
    base = settings.WC_API_URL.rstrip('/')
    return f"{base}/{endpoint.lstrip('/')}"


class WooCommerceProductAdapter(BaseProductAdapter):

    def list_products(self, category_slug=None, search=None, page=1, per_page=100):
        """Fetch products from WooCommerce REST API."""
        params = {
            'per_page': per_page,
            'page': page,
            'status': 'publish',
        }
        if category_slug:
            # WC needs category ID, not slug — look up locally or pass as-is
            cat = Category.objects.filter(slug=category_slug).first()
            if cat and cat.token_id:
                params['category'] = cat.token_id  # store WC cat ID in token_id
        if search:
            params['search'] = search

        try:
            resp = requests.get(
                _wc_url('products'),
                auth=_wc_auth(),
                params=params,
                timeout=15,
            )
            resp.raise_for_status()
            return resp.json()
        except requests.RequestException as e:
            logger.error(f"WooCommerce product fetch failed: {e}")
            return []

    def get_product(self, identifier):
        """Fetch a single product from WooCommerce by ID or slug."""
        # Try by slug first
        try:
            resp = requests.get(
                _wc_url('products'),
                auth=_wc_auth(),
                params={'slug': identifier, 'per_page': 1},
                timeout=15,
            )
            resp.raise_for_status()
            data = resp.json()
            if data:
                return data[0]
        except requests.RequestException as e:
            logger.error(f"WooCommerce product get failed: {e}")

        # Try by numeric ID
        try:
            resp = requests.get(
                _wc_url(f'products/{identifier}'),
                auth=_wc_auth(),
                timeout=15,
            )
            resp.raise_for_status()
            return resp.json()
        except requests.RequestException:
            return None

    def list_categories(self):
        """Fetch categories from WooCommerce."""
        try:
            resp = requests.get(
                _wc_url('products/categories'),
                auth=_wc_auth(),
                params={'per_page': 50},
                timeout=15,
            )
            resp.raise_for_status()
            return resp.json()
        except requests.RequestException as e:
            logger.error(f"WooCommerce category fetch failed: {e}")
            return []

    def sync_to_local(self):
        """Pull all products from WooCommerce into local Product model."""
        products = self.list_products(per_page=100)
        count = 0
        for wc_product in products:
            wc_id = wc_product.get('id')
            name = wc_product.get('name', '')
            slug = wc_product.get('slug', '')
            price = wc_product.get('price', '0')
            regular_price = wc_product.get('regular_price', '0')

            defaults = {
                'name': name,
                'slug': slug,
                'description': wc_product.get('description', ''),
                'base_price': float(price) if price else 0,
                'discounted_price': float(price) if price != regular_price else None,
                'is_active': wc_product.get('status') == 'publish',
            }

            _, created = Product.objects.update_or_create(
                external_id=wc_id,
                external_source='woocommerce',
                defaults=defaults,
            )
            if created:
                count += 1

        logger.info(f"WooCommerce sync: {count} new products, {len(products)} total processed")
        return count


class WooCommerceOrderAdapter(BaseOrderAdapter):

    def sync_order(self, order):
        """Create an order in WooCommerce matching the local order."""
        wc_line_items = []
        for item in order.items.select_related('product').all():
            product = item.product
            ext_id = product.external_id
            if ext_id:
                wc_line_items.append({
                    'product_id': int(ext_id),
                    'quantity': item.quantity,
                })

        if not wc_line_items:
            logger.warning(f"Order {order.id}: no items with external IDs, skipping WC sync")
            return None

        user = order.user
        wc_payload = {
            'payment_method': 'cod' if order.is_cod else 'other',
            'payment_method_title': 'Cash on Delivery' if order.is_cod else 'Wallet/Other',
            'set_paid': False,
            'billing': {
                'first_name': user.first_name or 'Guest',
                'last_name': user.last_name or '',
                'address_1': order.delivery_street,
                'city': order.delivery_city,
                'postcode': order.delivery_zip_code,
                'country': 'IN',
                'email': user.email or f"{user.phone_number}@example.com",
                'phone': user.phone_number,
            },
            'shipping': {
                'first_name': user.first_name or 'Guest',
                'last_name': user.last_name or '',
                'address_1': order.delivery_street,
                'city': order.delivery_city,
                'postcode': order.delivery_zip_code,
                'country': 'IN',
            },
            'line_items': wc_line_items,
        }

        try:
            resp = requests.post(
                _wc_url('orders'),
                auth=_wc_auth(),
                json=wc_payload,
                timeout=30,
            )
            if resp.status_code == 201:
                wc_data = resp.json()
                external_id = str(wc_data.get('id', ''))
                order.external_order_id = external_id
                order.save(update_fields=['external_order_id'])
                logger.info(f"Order {order.id} synced to WC as {external_id}")
                return external_id
            else:
                logger.error(f"WC order sync failed ({resp.status_code}): {resp.text}")
                return None
        except requests.RequestException as e:
            logger.error(f"WC order sync error: {e}")
            return None

    def update_item_weight(self, order, product, actual_weight):
        """Update the actual weight of an item in the WooCommerce order."""
        if not order.external_order_id:
            raise ValueError("Order is not synced to WooCommerce")
        if not product.external_id:
            raise ValueError("Product is not mapped to WooCommerce")

        wc_order_url = _wc_url(f"orders/{order.external_order_id}")

        # Fetch WC order to find line item ID
        try:
            resp = requests.get(wc_order_url, auth=_wc_auth(), timeout=15)
            resp.raise_for_status()
        except requests.RequestException as e:
            raise RuntimeError(f"Failed to fetch WC order: {e}")

        wc_order_data = resp.json()
        target_item_id = None
        for item in wc_order_data.get('line_items', []):
            if item['product_id'] == int(product.external_id):
                target_item_id = item['id']
                break

        if not target_item_id:
            raise ValueError("Item not found in WooCommerce order")

        update_payload = {
            'line_items': [{
                'id': target_item_id,
                'meta_data': [
                    {'key': 'Actual Weight', 'value': f"{actual_weight} kg"},
                    {'key': 'Picker Status', 'value': 'Weighed'},
                ],
            }],
        }

        try:
            update_resp = requests.put(
                wc_order_url, auth=_wc_auth(), json=update_payload, timeout=15
            )
            update_resp.raise_for_status()
            return True
        except requests.RequestException as e:
            raise RuntimeError(f"WC weight update failed: {e}")
