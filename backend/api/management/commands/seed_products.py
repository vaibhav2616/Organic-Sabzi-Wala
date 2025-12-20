from django.core.management.base import BaseCommand
from api.models import Product, UnitOfMeasure, Category

class Command(BaseCommand):
    help = 'Seeds the database with ONLY Organic categories and products'

    def handle(self, *args, **kwargs):
        self.stdout.write("Cleaning Non-Organic Data...")
        
        # Delete unwanted categories
        unwanted_slugs = ['snacks', 'drinks', 'instant-food', 'dairy-bread']
        Category.objects.filter(slug__in=unwanted_slugs).delete()
        
        # Ensure only organic categories exist
        self.stdout.write("Seeding Organic Data...")

        # 1. Units
        kg, _ = UnitOfMeasure.objects.get_or_create(name="Kilogram", symbol="kg")
        pc, _ = UnitOfMeasure.objects.get_or_create(name="Piece", symbol="pc")
        gram, _ = UnitOfMeasure.objects.get_or_create(name="Gram", symbol="g")
        
        # 2. Categories (Organic Only)
        categories_data = [
            {"name": "Organic Vegetables", "image": "https://cdn-icons-png.flaticon.com/512/2329/2329903.png", "slug": "organic-vegetables"},
            {"name": "Organic Fruits", "image": "https://cdn-icons-png.flaticon.com/512/1625/1625048.png", "slug": "organic-fruits"},
            {"name": "Organic Staples", "image": "https://cdn-icons-png.flaticon.com/512/766/766023.png", "slug": "organic-staples"},
        ]
        
        cats = {}
        for c in categories_data:
            cat, created = Category.objects.get_or_create(slug=c['slug'], defaults={'name': c['name'], 'token_id': c['image']}) 
            cats[c['slug']] = cat
            self.stdout.write(f"{'Created' if created else 'Found'} Category: {c['name']}")

        # 3. Products
        products = [
            # Organic Vegetables
            {"name": "Organic Onion", "cat": "organic-vegetables", "price": 50, "unit": kg, "w_val": 1.0, "w_unit": kg},
            {"name": "Organic Bio Potato", "cat": "organic-vegetables", "price": 40, "unit": kg, "w_val": 1.0, "w_unit": kg},
            {"name": "Desi Tomato", "cat": "organic-vegetables", "price": 35, "unit": kg, "w_val": 1.0, "w_unit": kg},
            {"name": "Organic Ginger", "cat": "organic-vegetables", "price": 30, "unit": gram, "w_val": 200, "w_unit": gram},
            {"name": "Organic Garlic", "cat": "organic-vegetables", "price": 60, "unit": gram, "w_val": 250, "w_unit": gram},
            {"name": "Fresh Spinach (Palak)", "cat": "organic-vegetables", "price": 25, "unit": pc, "w_val": 1, "w_unit": pc},
            {"name": "Organic Lemon", "cat": "organic-vegetables", "price": 10, "unit": pc, "w_val": 1, "w_unit": pc},
            {"name": "Cucumber (Desi)", "cat": "organic-vegetables", "price": 30, "unit": kg, "w_val": 1, "w_unit": kg},
            {"name": "Organic Carrot", "cat": "organic-vegetables", "price": 70, "unit": kg, "w_val": 1, "w_unit": kg},
            {"name": "Beetroot", "cat": "organic-vegetables", "price": 40, "unit": kg, "w_val": 1, "w_unit": kg},
            
            # Organic Fruits
            {"name": "Organic Banana", "cat": "organic-fruits", "price": 60, "unit": kg, "w_val": 1, "w_unit": kg},
            {"name": "Kashmir Apple", "cat": "organic-fruits", "price": 220, "unit": kg, "w_val": 1, "w_unit": kg},
            {"name": "Organic Pomegranate", "cat": "organic-fruits", "price": 150, "unit": kg, "w_val": 1, "w_unit": kg},
            {"name": "Sweet Papaya", "cat": "organic-fruits", "price": 60, "unit": pc, "w_val": 1, "w_unit": pc},
            
            # Staples
            {"name": "Organic Brown Rice", "cat": "organic-staples", "price": 120, "unit": kg, "w_val": 1, "w_unit": kg},
            {"name": "Whole Wheat Atta", "cat": "organic-staples", "price": 60, "unit": kg, "w_val": 1, "w_unit": kg},
            {"name": "Organic Tur Dal", "cat": "organic-staples", "price": 180, "unit": kg, "w_val": 1, "w_unit": kg},
        ]

        for p in products:
            prod, created = Product.objects.update_or_create(
                slug=p['name'].lower().replace(" ", "-"),
                defaults={
                    'name': p['name'],
                    'base_price': p['price'],
                    'pricing_unit': p['unit'],
                    'weight_value': p['w_val'],
                    'weight_unit': p['w_unit'],
                    'category': cats[p['cat']],
                    'is_organic': True,
                    'is_active': True
                }
            )
            self.stdout.write(f"{'Created' if created else 'Updated'} Product: {p['name']}")
