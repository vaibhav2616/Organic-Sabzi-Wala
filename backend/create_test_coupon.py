import os
import django
from django.utils import timezone
from datetime import timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import Coupon

def create_coupon():
    code = "TEST50"
    if Coupon.objects.filter(code=code).exists():
        print(f"Coupon {code} already exists.")
        return

    Coupon.objects.create(
        code=code,
        # description="Test Coupon 50 Off",  <-- Field does not exist
        discount_amount=50.00,
        min_order_value=100.00,
        # valid_from=timezone.now(),         <-- Field does not exist
        valid_until=timezone.now() + timedelta(days=30),
        is_active=True
    )
    print(f"Successfully created coupon: {code}")

if __name__ == "__main__":
    create_coupon()
