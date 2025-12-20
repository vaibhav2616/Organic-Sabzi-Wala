import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import User

if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin_password_123', phone_number='9999999999')
    print("Superuser created successfully.")
else:
    print("Superuser 'admin' already exists.")
