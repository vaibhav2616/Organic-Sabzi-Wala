"""
Local Adapter — reads/writes directly from Django models.
This is the default adapter when running without WooCommerce.
"""
from .base import BaseProductAdapter, BaseOrderAdapter
from api.models import Product, Category, Order, OrderItem


class LocalProductAdapter(BaseProductAdapter):

    def list_products(self, category_slug=None, search=None, page=1, per_page=100):
        qs = Product.objects.filter(is_active=True).select_related(
            'category', 'pricing_unit', 'weight_unit'
        )
        if category_slug:
            qs = qs.filter(category__slug=category_slug)
        if search:
            qs = qs.filter(name__icontains=search)

        start = (page - 1) * per_page
        return list(qs[start:start + per_page])

    def get_product(self, identifier):
        """Get product by UUID id or slug."""
        try:
            return Product.objects.select_related(
                'category', 'pricing_unit', 'weight_unit'
            ).get(slug=identifier)
        except Product.DoesNotExist:
            try:
                return Product.objects.select_related(
                    'category', 'pricing_unit', 'weight_unit'
                ).get(id=identifier)
            except (Product.DoesNotExist, ValueError):
                return None

    def list_categories(self):
        return list(Category.objects.all())

    def sync_to_local(self):
        """No-op for local adapter — data is already local."""
        return 0


class LocalOrderAdapter(BaseOrderAdapter):

    def sync_order(self, order):
        """No external sync needed — order is already in local DB."""
        return None

    def update_item_weight(self, order, product, actual_weight):
        """Update weight directly on the local OrderItem."""
        try:
            item = OrderItem.objects.get(order=order, product=product)
            # Store actual weight as metadata (add field if needed, or use
            # a JSON field — for now we update price_at_purchase proportionally)
            # In the future, add an `actual_weight` field to OrderItem.
            item.save()
            return True
        except OrderItem.DoesNotExist:
            return False
