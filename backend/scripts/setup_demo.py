import os
import django
from django.contrib.auth import get_user_model
from api.models import Product, UnitOfMeasure, DeliveryZone
from django.core.files.base import ContentFile

User = get_user_model()

def run():
    print("--- Starting Demo Setup ---")

    # 1. Create Superuser
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@example.com', 'admin')
        print("✅ Superuser created: admin / admin")
    else:
        print("ℹ️ Superuser 'admin' already exists.")

    # 2. Create UOMs
    uom_pc, _ = UnitOfMeasure.objects.get_or_create(name='Piece', symbol='pc')
    uom_kg, _ = UnitOfMeasure.objects.get_or_create(name='Kilogram', symbol='kg')
    uom_l, _ = UnitOfMeasure.objects.get_or_create(name='Liter', symbol='l')
    print("✅ Unit of Measures created.")

    # 3. Create Delivery Zones
    DeliveryZone.objects.get_or_create(zip_code='226001', city='Lucknow', defaults={'delivery_time_hrs': 6, 'is_serviceable': True})
    DeliveryZone.objects.get_or_create(zip_code='208001', city='Kanpur', defaults={'delivery_time_hrs': 24, 'is_serviceable': True})
    print("✅ Delivery Zones created.")

    # 4. Create Products
    products_data = [
        {
            'name': 'Organic Lemon',
            'slug': 'organic-lemon',
            'base_price': 10.00,
            'pricing_unit': uom_pc,
            'weight_value': 50,
            'weight_unit': uom_kg, # 0.05 kg really, but let's say 50g -> need 'gram' UOM? Or just use kg fraction.
            # Let's add Gram for better display
            'is_organic': True
        },
        {
            'name': 'Fresh Potato (New Harvest)',
            'slug': 'fresh-potato',
            'base_price': 40.00,
            'pricing_unit': uom_kg,
            'weight_value': 1,
            'weight_unit': uom_kg,
            'is_organic': True
        },
        {
            'name': 'Cow Milk (Glass Bottle)',
            'slug': 'cow-milk',
            'base_price': 80.00,
            'pricing_unit': uom_l,
            'weight_value': 1,
            'weight_unit': uom_l,
            'is_organic': False
        }
    ]
    
    # Fix UOMs for display if needed
    uom_g, _ = UnitOfMeasure.objects.get_or_create(name='Gram', symbol='g')

    for p_data in products_data:
        if p_data['slug'] == 'organic-lemon':
            p_data['weight_unit'] = uom_g
        
        obj, created = Product.objects.get_or_create(slug=p_data['slug'], defaults=p_data)
        if created:
             print(f"✅ Created Product: {obj.name}")
        else:
             print(f"ℹ️ Product {obj.name} already exists.")

    print("--- Demo Setup Complete ---")

if __name__ == '__main__':
    run()
