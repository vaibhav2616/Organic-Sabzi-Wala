from django.conf import settings


def get_product_adapter():
    """Factory: returns the active product adapter based on settings."""
    backend = getattr(settings, 'PRODUCT_BACKEND', 'local')
    if backend == 'woocommerce':
        from .woocommerce_adapter import WooCommerceProductAdapter
        return WooCommerceProductAdapter()
    from .local_adapter import LocalProductAdapter
    return LocalProductAdapter()


def get_order_adapter():
    """Factory: returns the active order adapter based on settings."""
    backend = getattr(settings, 'PRODUCT_BACKEND', 'local')
    if backend == 'woocommerce':
        from .woocommerce_adapter import WooCommerceOrderAdapter
        return WooCommerceOrderAdapter()
    from .local_adapter import LocalOrderAdapter
    return LocalOrderAdapter()
