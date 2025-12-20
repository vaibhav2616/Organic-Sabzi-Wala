
import os
import django
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from api.models import User, Product
import json

# Setup
user, _ = User.objects.get_or_create(phone_number='+919999999999', defaults={'username': 'testuser'})
refresh = RefreshToken.for_user(user)
access_token = str(refresh.access_token)
client = APIClient()
# client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}') # Proxy/List are AllowAny

print("--- Verifying Product APIs ---")

# 1. Product List (Used by Search)
print("\n1. Testing 'GET /api/products/' (Local DB)...")
try:
    response = client.get('/api/products/')
    if response.status_code == 200:
        data = response.json()
        # Expect StandardResponseRenderer format: { success, data: [...], ... }
        if data.get('success') is True and isinstance(data.get('data'), list):
            count = len(data['data'])
            print(f"SUCCESS: Retrieved {count} products from Local DB.")
            if count < 5:
                print("WARNING: Low product count. Sync might be needed.")
        else:
            print(f"FAILED Format: Keys found: {data.keys()}")
            if 'data' in data: print(f"Data Type: {type(data['data'])}")
    else:
        print(f"FAILED: Status {response.status_code}")
except Exception as e:
    print(f"ERROR: {e}")

# 2. Product Proxy (Used by Home)
print("\n2. Testing 'GET /api/proxy/products/' (WooCommerce)...")
try:
    response = client.get('/api/proxy/products/')
    if response.status_code == 200:
        data = response.json()
        # Expect Direct List: [...]
        if isinstance(data, list):
            count = len(data)
            print(f"SUCCESS: Retrieved {count} products from WooCommerce Proxy.")
        else:
            print(f"FAILED Format: Expected List, got {type(data)}")
    else:
        print(f"FAILED: Status {response.status_code} - Is WC Server reachable?")
except Exception as e:
    print(f"ERROR: {e}")

# 3. Search Simulation (Frontend Logic)
print("\n3. Simulating Search Logic...")
# Frontend gets /api/products/ and filters client side.
# We verified /api/products/ works above. 
# Let's verify SERVER SIDE filtering too just in case we switch.
try:
    response = client.get('/api/products/?search=lemon')
    if response.status_code == 200:
        data = response.json()
        results = data.get('data', [])
        print(f"Server-Side Search 'lemon': Found {len(results)} items.")
    else:
        print(f"Server-Side Search Failed: {response.status_code}")
except Exception as e:
    print(f"ERROR: {e}")
