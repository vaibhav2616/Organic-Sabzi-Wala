import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import Product

def list_products():
    for p in Product.objects.all():
        print(f"ID: {p.id} | Name: {p.name} | Base Price: {p.base_price}")

if __name__ == "__main__":
    list_products()
