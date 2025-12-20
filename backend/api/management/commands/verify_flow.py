
from django.core.management.base import BaseCommand
from api.models import User, Product, Order, Address, Coupon
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

class Command(BaseCommand):
    help = 'Verify Full Order Flow'

    def handle(self, *args, **options):
        self.stdout.write("--- Starting Full E2E Test ---")

        # 1. Auth and Setup
        user, _ = User.objects.get_or_create(phone_number='+919999999999', defaults={'username': 'testuser'})
        user.is_phone_verified = True
        user.save()
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        self.stdout.write(f"User: {user.username} (Authenticated)")

        # 2. Get Product
        products = Product.objects.all()[:1]
        if not products:
            self.stdout.write("!! No Products Found. Sync Required.")
            return

        product = products[0]
        self.stdout.write(f"Selected: {product.name} (External ID: {product.external_id})")

        # 3. Create Coupon
        coupon, _ = Coupon.objects.get_or_create(code='WELCOME50', is_active=True, defaults={'discount_amount': 50, 'min_order_value': 100})
        self.stdout.write(f"Coupon: {coupon.code}")

        # 4. Place Order
        addr, _ = Address.objects.get_or_create(user=user, defaults={
            'name': 'Test User', 'street': '123 Street', 'city': 'Lucknow', 'zip_code': '226001'
        })

        payload = {
            "items": [{"product_id": str(product.external_id or product.id), "quantity": 1}],
            "total_amount": float(product.base_price),
            "address_id": addr.id,
            "payment_method": "COD",
            "coupon_code": "WELCOME50"
        }

        try:
            response = client.post('/api/orders/place/', payload, format='json')
            if response.status_code == 201:
                self.stdout.write(self.style.SUCCESS(f"SUCCESS: Order Placed! ID: {response.data.get('order_id')}"))
            else:
                self.stdout.write(self.style.ERROR(f"FAILED: {response.status_code}"))
                if hasattr(response, 'data'):
                    self.stdout.write(f"Data: {response.data}")
                else:
                    self.stdout.write(f"Content: {response.content}")
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"ERROR: {e}"))
