from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from api.models import Product, UnitOfMeasure, DeliveryZone

class ViewTestCase(APITestCase):
    def setUp(self):
        self.uom_pc = UnitOfMeasure.objects.create(name='Piece', symbol='pc')
        self.product = Product.objects.create(
            slug='test-lemon',
            name='Test Lemon',
            base_price=10.00,
            pricing_unit=self.uom_pc,
            weight_value=50,
            weight_unit=self.uom_pc,
            is_organic=True
        )
        
        # Create Delivery Zones
        DeliveryZone.objects.create(zip_code='226001', city='Lucknow', delivery_time_hrs=6, is_serviceable=True)

    def test_product_list_trust_badge(self):
        url = reverse('product-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Parse JSON to check Renderer output
        data = response.json()
        self.assertTrue(data['success'])
        
        # Check Trust Badge
        found = False
        for p in data['data']:
            if p['slug'] == 'test-lemon':
                self.assertEqual(p['trust_badge'], 'Certified Organic')
                found = True
        self.assertTrue(found)

    def test_check_delivery_lucknow(self):
        url = reverse('check-delivery')
        data_input = {'zip_code': '226001'}
        response = self.client.post(url, data_input)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        data = response.json()
        self.assertEqual(data['data']['delivery_time_hrs'], 6)

    def test_check_delivery_kanpur_logic(self):
        url = reverse('check-delivery')
        data_input = {'zip_code': '208001'} # Not in DB, but matches logic
        response = self.client.post(url, data_input)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        data = response.json()
        self.assertEqual(data['data']['delivery_time_hrs'], 24)

    def test_cart_add_validation(self):
        url = reverse('cart-add')
        
        # Valid Integer
        data_valid = {'product_id': self.product.id, 'quantity': 2.0}
        resp_valid = self.client.post(url, data_valid)
        self.assertEqual(resp_valid.status_code, status.HTTP_200_OK)

        # Invalid Float for Piece
        data_invalid = {'product_id': self.product.id, 'quantity': 2.5}
        resp_invalid = self.client.post(url, data_invalid)
        self.assertEqual(resp_invalid.status_code, status.HTTP_400_BAD_REQUEST)
        
        resp_data = resp_invalid.json()
        self.assertFalse(resp_data['success'])
        # Errors might be in 'errors' or 'data' depending on renderer logic for 400
        # Check renderer: if status >= 400: errors = data, data = None
        # So look in 'errors'
        self.assertIn("cannot buy fractional amounts", str(resp_data['errors']))

