
import os
import django
import requests
from django.conf import settings
from collections import Counter

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

def check_statuses():
    print("Fetching WC Data...")
    url = f"{settings.WC_API_URL}products"
    auth = (settings.WC_CONSUMER_KEY, settings.WC_CONSUMER_SECRET)
    
    response = requests.get(url, auth=auth, params={'per_page': 100})
    if response.status_code != 200:
        print("Error fetching WC")
        return

    products = response.json()
    statuses = [p.get('status') for p in products]
    print(f"Total: {len(products)}")
    print(f"Status Counts: {Counter(statuses)}")

if __name__ == "__main__":
    check_statuses()
