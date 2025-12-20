import os
import django
from django.contrib.auth import get_user_model

User = get_user_model()

def run():
    print("--- Resetting Admin Password ---")
    try:
        u = User.objects.get(username='admin')
        u.set_password('admin')
        u.save()
        print("✅ Password for 'admin' set to 'admin'")
    except User.DoesNotExist:
        print("❌ User 'admin' not found. Creating it...")
        User.objects.create_superuser('admin', 'admin@example.com', 'admin')
        print("✅ Superuser 'admin' created with password 'admin'")
    
    print("--- Done ---")

if __name__ == '__main__':
    run()
