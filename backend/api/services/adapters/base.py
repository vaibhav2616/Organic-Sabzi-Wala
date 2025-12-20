from abc import ABC, abstractmethod


class BaseProductAdapter(ABC):
    """Interface for product data operations. Implement this to add a new backend."""

    @abstractmethod
    def list_products(self, category_slug=None, search=None, page=1, per_page=100):
        """Return a list of product dicts in canonical format."""
        ...

    @abstractmethod
    def get_product(self, identifier):
        """Return a single product dict by ID or slug."""
        ...

    @abstractmethod
    def list_categories(self):
        """Return a list of category dicts."""
        ...

    @abstractmethod
    def sync_to_local(self):
        """Pull products from external source into local DB. Returns count synced."""
        ...


class BaseOrderAdapter(ABC):
    """Interface for order sync operations."""

    @abstractmethod
    def sync_order(self, order):
        """
        Sync a local Order to the external system.
        Returns external_order_id or None.
        """
        ...

    @abstractmethod
    def update_item_weight(self, order, product, actual_weight):
        """
        Update the weight of an item in an external order.
        Returns True on success, raises on failure.
        """
        ...
