"""
ProductService — business logic for products and categories.
Views call this; it delegates to the active adapter.
"""
import logging
from api.models import Product, Category
from api.serializers import ProductSerializer
from .adapters import get_product_adapter

logger = logging.getLogger(__name__)


class ProductService:
    def __init__(self, adapter=None):
        self.adapter = adapter or get_product_adapter()

    def list_products(self, category_slug=None, search=None, page=1, per_page=100):
        """
        Returns serialized product data from the active backend.
        For 'local' backend: queries Django models and serializes.
        For 'woocommerce' backend: returns raw WC JSON (passed through).
        """
        from django.conf import settings
        backend = getattr(settings, 'PRODUCT_BACKEND', 'local')

        if backend == 'local':
            products = self.adapter.list_products(category_slug, search, page, per_page)
            # Serialize Django model instances
            serializer = ProductSerializer(products, many=True)
            return serializer.data
        else:
            # WooCommerce adapter returns raw JSON dicts
            return self.adapter.list_products(category_slug, search, page, per_page)

    def get_product(self, identifier):
        """Returns serialized product data by slug or ID."""
        from django.conf import settings
        backend = getattr(settings, 'PRODUCT_BACKEND', 'local')

        if backend == 'local':
            product = self.adapter.get_product(identifier)
            if product is None:
                return None
            serializer = ProductSerializer(product)
            return serializer.data
        else:
            return self.adapter.get_product(identifier)

    def list_categories(self):
        """Returns category list from active backend."""
        from django.conf import settings
        backend = getattr(settings, 'PRODUCT_BACKEND', 'local')

        if backend == 'local':
            categories = self.adapter.list_categories()
            return [
                {
                    'id': cat.id,
                    'name': cat.name,
                    'slug': cat.slug,
                    'image': cat.token_id or '',
                }
                for cat in categories
            ]
        else:
            raw = self.adapter.list_categories()
            return [
                {
                    'id': c.get('id'),
                    'name': c.get('name', ''),
                    'slug': c.get('slug', ''),
                    'image': (c.get('image', {}) or {}).get('src', ''),
                }
                for c in raw
            ]

    def sync_from_external(self):
        """Pull products from external source into local DB."""
        return self.adapter.sync_to_local()
