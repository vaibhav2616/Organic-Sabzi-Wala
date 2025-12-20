import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import Order

try:
    latest_order = Order.objects.latest('created_at')
    print(f"Latest Order ID: {latest_order.id}")
    print(f"External Order ID: {latest_order.external_order_id}")
    if latest_order.external_order_id:
        print("SUCCESS: External Order ID found.")
    else:
        print("INFO: No external order ID (local-only order).")
except Order.DoesNotExist:
    print("No orders found.")
