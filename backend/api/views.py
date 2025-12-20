from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.throttling import AnonRateThrottle
from .renderers import StandardResponseRenderer
from .services import ProductService


class ProductProxyThrottle(AnonRateThrottle):
    rate = '1000/hour'


class ProductListAPIView(APIView):
    """
    Unified product list endpoint.
    Uses the active backend (local DB or WooCommerce) via ProductService.
    """
    throttle_classes = [ProductProxyThrottle]
    renderer_classes = [StandardResponseRenderer]

    def get(self, request):
        service = ProductService()
        category = request.query_params.get('category')
        search = request.query_params.get('search')
        page = int(request.query_params.get('page', 1))
        per_page = int(request.query_params.get('per_page', 100))

        products = service.list_products(
            category_slug=category,
            search=search,
            page=page,
            per_page=per_page,
        )
        return Response(products)


class ProductDetailAPIView(APIView):
    """Single product by slug or ID."""
    renderer_classes = [StandardResponseRenderer]

    def get(self, request, identifier):
        service = ProductService()
        product = service.get_product(identifier)
        if product is None:
            return Response(
                {'error': 'Product not found'},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(product)


class CategoryListAPIView(APIView):
    """List all product categories."""
    renderer_classes = [StandardResponseRenderer]

    def get(self, request):
        service = ProductService()
        categories = service.list_categories()
        return Response(categories)


class ProductProxyView(APIView):
    """
    LEGACY: Direct WooCommerce proxy (kept for backward compatibility).
    New code should use ProductListAPIView instead.
    """
    throttle_classes = [ProductProxyThrottle]

    def get(self, request):
        from django.conf import settings
        import requests as http_requests

        url = f"{settings.WC_API_URL}products"
        params = dict(request.query_params)
        params.setdefault('per_page', ['100'])
        auth = (settings.WC_CONSUMER_KEY, settings.WC_CONSUMER_SECRET)

        try:
            response = http_requests.get(url, params=params, auth=auth, timeout=15)
            return Response(response.json(), status=response.status_code)
        except http_requests.RequestException as e:
            return Response(
                {'error': f'WooCommerce connection failed: {str(e)}'},
                status=status.HTTP_502_BAD_GATEWAY,
            )


class RootView(APIView):
    """Health check / welcome endpoint."""

    def get(self, request):
        return Response({
            'message': 'Organic Sabzi Wala API',
            'version': '2.0',
            'status': 'running',
        })


# === Legacy Views (preserved for backward compatibility) ===

class ProductListView(APIView):
    """
    LEGACY: Lists products from local DB using Django serializer.
    Replaced by ProductListAPIView above, but kept for existing URL references.
    """
    renderer_classes = [StandardResponseRenderer]

    def get(self, request):
        from .models import Product
        from .serializers import ProductSerializer
        products = Product.objects.filter(is_active=True).select_related(
            'category', 'pricing_unit', 'weight_unit'
        )
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)


class CheckDeliveryView(APIView):
    """Check if delivery is available for a given zip code."""
    renderer_classes = [StandardResponseRenderer]

    def post(self, request):
        from .models import DeliveryZone
        zip_code = request.data.get('zip_code', '')
        try:
            zone = DeliveryZone.objects.get(zip_code=zip_code, is_serviceable=True)
            return Response({
                'available': True,
                'city': zone.city,
                'delivery_time_hrs': zone.delivery_time_hrs,
            })
        except DeliveryZone.DoesNotExist:
            return Response({
                'available': False,
                'message': 'Delivery not available in your area yet.',
            })


class CartAddView(APIView):
    """Validate and add an item to cart (server-side validation)."""
    renderer_classes = [StandardResponseRenderer]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        from .serializers import CartAddSerializer
        serializer = CartAddSerializer(data=request.data)
        if serializer.is_valid():
            product = serializer.validated_data['product']
            quantity = serializer.validated_data['quantity']
            return Response({
                'success': True,
                'product_id': str(product.id),
                'product_name': product.name,
                'quantity': quantity,
                'price': float(product.discounted_price or product.base_price),
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
