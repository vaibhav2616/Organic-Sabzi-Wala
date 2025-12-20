from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from api.models import Product, UnitOfMeasure, DeliveryZone, User, Order

class ProductionLogicTests(APITestCase):
    def setUp(self):
        # Setup UOMs
        self.uom_pc = UnitOfMeasure.objects.create(name='Piece', symbol='pc')
        self.uom_kg = UnitOfMeasure.objects.create(name='Kilogram', symbol='kg')
        
        # Setup Product (Lemon)
        self.lemon = Product.objects.create(
            name='Lemon',
            base_price=5.00,
            pricing_unit=self.uom_pc,
            weight_value=50,
            weight_unit=self.uom_kg # 50g approx
        )
        
        # Setup User
        self.user = User.objects.create_user(phone_number='9999999999', username='9999999999', password='pw')
        
        # Setup Delivery Zones
        DeliveryZone.objects.create(zip_code='226001', city='Lucknow', delivery_time_hrs=6, is_serviceable=True)
        DeliveryZone.objects.create(zip_code='208001', city='Kanpur', delivery_time_hrs=24, is_serviceable=True)

    def test_lemon_weight_pricing_fix(self):
        """Test that purchasing 0.5 units of a 'Piece' item fails."""
        url = reverse('cart-add')
        data = {
            'product_id': self.lemon.id,
            'quantity': 0.5 # Invalid for 'Piece'
        }
        response = self.client.post(url, data, format='json')
        # Expecting validation error
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("fractional", str(response.json())) # Should mention fractional prohibition

    def test_sla_dynamicity(self):
        """Test SLA switches based on Zip."""
        url = reverse('check-delivery')
        
        # Lucknow
        # Lucknow
        resp_lucknow = self.client.post(url, {'zip_code': '226001'}, format='json')
        print(f"DEBUG SLA LUCKNOW: {resp_lucknow.json()}")
        self.assertEqual(resp_lucknow.json()['data']['delivery_time_hrs'], 6)
        
        # Kanpur
        resp_kanpur = self.client.post(url, {'zip_code': '208001'}, format='json')
        self.assertEqual(resp_kanpur.json()['data']['delivery_time_hrs'], 24)

    def test_cod_interceptor_security(self):
        """Test COD fails if NOT verified."""
        # Unverified User
        self.user.is_phone_verified = False
        self.user.save()
        self.client.force_authenticate(user=self.user)
        
        url = reverse('place-order')
        response = self.client.post(url, {'payment_method': 'COD'}, format='json')
        
        # Expect Forbidden + Action Required
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.json()['action_required'], 'VERIFY_OTP')

    def test_payment_webhook(self):
        """Test that payment success callback updates order status."""
        self.user.is_phone_verified = True
        self.user.save()
        
        # Create Order first
        order = Order.objects.create(user=self.user, total_price=100)
        
        # Call Webhook
        url = reverse('payment-webhook')
        data = {'order_id': order.id, 'payment_id': 'pay_123456'}
        self.client.post(url, data, format='json')
        
        # Verify DB Update
        order.refresh_from_db()
        self.assertEqual(order.payment_status, 'COMPLETED')
        self.assertEqual(order.transaction_id, 'pay_123456')
