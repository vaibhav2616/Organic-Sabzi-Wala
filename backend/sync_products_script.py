import os
import django
import requests

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.conf import settings
from api.models import Product, Category, UnitOfMeasure, Order, OrderItem, Subscription, Wishlist
from django.utils.text import slugify
from django.core.files.base import ContentFile

def sync_products():
    print("Fetching products from WooCommerce...")
    url = f"{settings.WC_API_URL}products"
    auth = (settings.WC_CONSUMER_KEY, settings.WC_CONSUMER_SECRET)
    
    # Fetch all (pagination needed in real world, fetching 100 for now)
    response = requests.get(url, auth=auth, params={'per_page': 100})
    
    if response.status_code != 200:
        print(f"Failed to fetch: {response.status_code} - {response.text}")
        return

    products_data = response.json()
    print(f"Found {len(products_data)} products. Syncing...")

    # Clear existing data to avoid conflicts
    print("Clearing existing local products and dependencies...")
    OrderItem.objects.all().delete()
    Order.objects.all().delete()
    Subscription.objects.all().delete()
    Wishlist.objects.all().delete()
    Product.objects.all().delete()
    # Category.objects.all().delete()

    # Ensure defaults
    default_unit, _ = UnitOfMeasure.objects.get_or_create(name='Piece', symbol='pc')
    
    for p_data in products_data:
        ext_id = p_data.get('id')
        name = p_data.get('name')
        slug = p_data.get('slug') or slugify(name)
        regular_price = p_data.get('regular_price') or '0'
        sale_price = p_data.get('sale_price') or regular_price
        price = p_data.get('price') or sale_price
        
        # Categories
        cat_obj = None
        if p_data.get('categories'):
            cat_data = p_data['categories'][0] # Take first
            cat_obj, _ = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={'slug': cat_data['slug']}
            )

        # Download Image
        image_content = None
        image_name = None
        if p_data.get('images'):
            img_url = p_data['images'][0]['src']
            try:
                print(f"Downloading image for {name}...")
                img_resp = requests.get(img_url, timeout=10)
                if img_resp.status_code == 200:
                    from django.core.files.base import ContentFile
                    image_content = ContentFile(img_resp.content)
                    image_name = f"product_{ext_id}.jpg"
            except Exception as e:
                print(f"Error downloading image: {e}")

        # Update or Create
        defaults = {
            'name': name,
            'slug': slug,
            'description': p_data.get('description', ''),
            'base_price': float(price) if price else 0.0,
            'discounted_price': float(sale_price) if sale_price else None,
            'category': cat_obj,
            'pricing_unit': default_unit, 
            'weight_value': 1, 
            'weight_unit': default_unit,
            'is_active': p_data.get('status') == 'publish',
        }
        
        product, created = Product.objects.update_or_create(
            external_id=str(ext_id),
            external_source='woocommerce',
            defaults=defaults
        )
        
        # Save image if downloaded
        if image_content and image_name:
            product.image.save(image_name, image_content, save=True)

        status = "Created" if created else "Updated"
        status = "Created" if created else "Updated"
        print(f"[{status}] {product.name} (External: {ext_id})")

if __name__ == "__main__":
    sync_products()
