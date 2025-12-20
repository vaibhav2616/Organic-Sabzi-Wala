
from django.core.management.base import BaseCommand
from api.models import Product
from rest_framework.test import APIClient
import json

class Command(BaseCommand):
    help = 'Verify Product APIs'

    def handle(self, *args, **options):
        client = APIClient()
        self.stdout.write("--- Verifying Product APIs ---")

        # 1. Local DB List
        res_local = client.get('/api/products/')
        if res_local.status_code == 200:
            data = res_local.json()
            # StandardResponseRenderer wraps in 'data' dictionary?
            # Or if list is passed, formatted_data['data'] = list.
            items = data.get('data', [])
            self.stdout.write(f"Local DB (Search API): {len(items)} items found.")
        else:
            self.stdout.write(f"Local DB Failed: {res_local.status_code}")

        # 2. Proxy
        res_proxy = client.get('/api/proxy/products/')
        if res_proxy.status_code == 200:
            data = res_proxy.json()
            if isinstance(data, list):
                self.stdout.write(f"Proxy (Home API): {len(data)} items found (Target: 99+).")
            else:
                 self.stdout.write(f"Proxy returned non-list: {type(data)}")
        else:
            self.stdout.write(f"Proxy Failed: {res_proxy.status_code}")
