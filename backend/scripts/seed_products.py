import os
import django
import random
import sys

# Setup Django Environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Product, UnitOfMeasure, Category

def run_seed():
    print("Seeding Data...")
    
    # 1. Units
    kg, _ = UnitOfMeasure.objects.get_or_create(name="Kilogram", symbol="kg")
    pc, _ = UnitOfMeasure.objects.get_or_create(name="Piece", symbol="pc")
    liter, _ = UnitOfMeasure.objects.get_or_create(name="Liter", symbol="l")
    gram, _ = UnitOfMeasure.objects.get_or_create(name="Gram", symbol="g")
    
    # 2. Categories
    categories_data = [
        {"name": "Vegetables", "image": "https://cdn-icons-png.flaticon.com/512/2329/2329903.png", "slug": "vegetables"},
        {"name": "Fruits", "image": "https://cdn-icons-png.flaticon.com/512/1625/1625048.png", "slug": "fruits"},
        {"name": "Dairy & Bread", "image": "https://cdn-icons-png.flaticon.com/512/305/305108.png", "slug": "dairy-bread"},
        {"name": "Snacks & Munchies", "image": "https://cdn-icons-png.flaticon.com/512/2553/2553691.png", "slug": "snacks"},
        {"name": "Cold Drinks & Juices", "image": "https://cdn-icons-png.flaticon.com/512/2405/2405479.png", "slug": "drinks"},
        {"name": "Instant Food", "image": "https://cdn-icons-png.flaticon.com/512/2763/2763784.png", "slug": "instant-food"},
    ]
    
    cats = {}
    for c in categories_data:
        cat, created = Category.objects.get_or_create(slug=c['slug'], defaults={'name': c['name'], 'token_id': c['image']}) # Using token_id for image url temporarily if no image field
        cats[c['slug']] = cat
        print(f"{'Created' if created else 'Found'} Category: {c['name']}")

    # 3. Products
    products = [
        # Vegetables
        {"name": "Fresh Onion", "cat": "vegetables", "price": 40, "unit": kg, "w_val": 1.0, "w_unit": kg},
        {"name": "Potato (New Crop)", "cat": "vegetables", "price": 30, "unit": kg, "w_val": 1.0, "w_unit": kg},
        {"name": "Tomato Hybrid", "cat": "vegetables", "price": 25, "unit": kg, "w_val": 0.5, "w_unit": kg},
        {"name": "Green Chilli", "cat": "vegetables", "price": 15, "unit": gram, "w_val": 100, "w_unit": gram},
        {"name": "Ginger (Adrak)", "cat": "vegetables", "price": 20, "unit": gram, "w_val": 200, "w_unit": gram},
        {"name": "Garlic", "cat": "vegetables", "price": 45, "unit": gram, "w_val": 250, "w_unit": gram},
        {"name": "Coriander Leaves", "cat": "vegetables", "price": 10, "unit": pc, "w_val": 1, "w_unit": pc},
        {"name": "Lemon", "cat": "vegetables", "price": 5, "unit": pc, "w_val": 1, "w_unit": pc},
        {"name": "Cucumber", "cat": "vegetables", "price": 20, "unit": kg, "w_val": 0.5, "w_unit": kg},
        {"name": "Carrot (Ooty)", "cat": "vegetables", "price": 60, "unit": kg, "w_val": 0.5, "w_unit": kg},
        
        # Fruits
        {"name": "Banana Robusta", "cat": "fruits", "price": 40, "unit": kg, "w_val": 1, "w_unit": kg},
        {"name": "Apple Royal Gala", "cat": "fruits", "price": 180, "unit": kg, "w_val": 1, "w_unit": kg},
        {"name": "Pomegranate (Anaar)", "cat": "fruits", "price": 120, "unit": kg, "w_val": 1, "w_unit": kg},
        {"name": "Watermelon", "cat": "fruits", "price": 50, "unit": pc, "w_val": 1, "w_unit": pc},
        {"name": "Papaya", "cat": "fruits", "price": 45, "unit": pc, "w_val": 1, "w_unit": pc},
        
        # Dairy
        {"name": "Amul Taaza Milk", "cat": "dairy-bread", "price": 27, "unit": pc, "w_val": 500, "w_unit": liter},
        {"name": "Amul Gold Milk", "cat": "dairy-bread", "price": 33, "unit": pc, "w_val": 500, "w_unit": liter},
        {"name": "Bread (Brown)", "cat": "dairy-bread", "price": 45, "unit": pc, "w_val": 1, "w_unit": pc},
        {"name": "Butter (Salted)", "cat": "dairy-bread", "price": 56, "unit": pc, "w_val": 100, "w_unit": gram},
        {"name": "Paneer", "cat": "dairy-bread", "price": 85, "unit": pc, "w_val": 200, "w_unit": gram},
        
        # Snacks
        {"name": "Lays Classic Salted", "cat": "snacks", "price": 20, "unit": pc, "w_val": 50, "w_unit": gram},
        {"name": "Kurkure Masala Munch", "cat": "snacks", "price": 20, "unit": pc, "w_val": 90, "w_unit": gram},
        {"name": "Doritos Cheese", "cat": "snacks", "price": 50, "unit": pc, "w_val": 150, "w_unit": gram},
        {"name": "Bhujia Sev", "cat": "snacks", "price": 110, "unit": pc, "w_val": 400, "w_unit": gram},
        {"name": "Good Day Cashew", "cat": "snacks", "price": 30, "unit": pc, "w_val": 120, "w_unit": gram},

        # Drinks
        {"name": "Coca Cola", "cat": "drinks", "price": 40, "unit": pc, "w_val": 750, "w_unit": liter},
        {"name": "Thumbs Up", "cat": "drinks", "price": 40, "unit": pc, "w_val": 750, "w_unit": liter},
        {"name": "Real Mixed Fruit", "cat": "drinks", "price": 110, "unit": pc, "w_val": 1, "w_unit": liter},
        {"name": "Sprite", "cat": "drinks", "price": 40, "unit": pc, "w_val": 750, "w_unit": liter},
        {"name": "Maaza", "cat": "drinks", "price": 60, "unit": pc, "w_val": 1.2, "w_unit": liter},
    ]

    for p in products:
        prod, created = Product.objects.get_or_create(
            slug=p['name'].lower().replace(" ", "-"),
            defaults={
                'name': p['name'],
                'base_price': p['price'],
                'pricing_unit': p['unit'],
                'weight_value': p['w_val'],
                'weight_unit': p['w_unit'],
                'category': cats[p['cat']],
                'is_organic': p['cat'] in ['vegetables', 'fruits'], # Just a heuristic
                'is_active': True
            }
        )
        print(f"{'Created' if created else 'Skipped'} Product: {p['name']}")

if __name__ == "__main__":
    run_seed()
