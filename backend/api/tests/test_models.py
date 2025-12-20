from django.test import TestCase
from api.models import User, UnitOfMeasure, Product, DeliveryZone, Order, OrderItem
from decimal import Decimal

class ModelTestCase(TestCase):
    def setUp(self):
        # Create UOMs
        self.uom_kg = UnitOfMeasure.objects.create(name='Kilogram', symbol='kg')
        self.uom_pc = UnitOfMeasure.objects.create(name='Piece', symbol='pc')
        
        # Create Admin User
        self.user = User.objects.create_superuser('admin', 'admin@example.com', 'pass', phone_number='9999999999')

    def test_product_creation(self):
        """Test creating a product with specific UOMs"""
        lemon = Product.objects.create(
            slug='lemon-organic',
            name='Organic Lemon',
            base_price=Decimal('5.00'),
            pricing_unit=self.uom_pc,
            weight_value=Decimal('50.00'),
            weight_unit=self.uom_kg,
            is_organic=True
        )
        self.assertEqual(lemon.pricing_unit.symbol, 'pc')
        self.assertTrue(lemon.is_organic)
        self.assertEqual(str(lemon), 'Organic Lemon')

    def test_delivery_zone(self):
        """Test delivery zone logic"""
        zone = DeliveryZone.objects.create(
            zip_code='226001',
            city='Lucknow',
            delivery_time_hrs=6,
            is_serviceable=True
        )
        self.assertEqual(zone.delivery_time_hrs, 6)

    def test_order_creation(self):
        """Test order creation with items"""
        lemon = Product.objects.create(
            slug='lemon', name='Lemon', base_price=5, 
            pricing_unit=self.uom_pc, weight_value=50, weight_unit=self.uom_kg
        )
        order = Order.objects.create(
            user=self.user,
            total_price=50.00,
            is_cod=True
        )
        OrderItem.objects.create(order=order, product=lemon, quantity=10, price_at_purchase=5)
        
        self.assertEqual(order.items.count(), 1)
        self.assertEqual(order.user.username, 'admin')
