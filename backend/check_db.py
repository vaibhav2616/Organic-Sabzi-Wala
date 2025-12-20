import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import Product, Category
print(f"Total products: {Product.objects.count()}")
print(f"Active products: {Product.objects.filter(is_active=True).count()}")
print(f"Categories: {Category.objects.count()}")
for p in Product.objects.all()[:5]:
    print(f"  - {p.name} | external_id={p.external_id} | active={p.is_active}")
