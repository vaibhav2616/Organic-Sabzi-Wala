from django.core.management.base import BaseCommand
from api.models import Coupon
from django.utils import timezone
from datetime import timedelta

class Command(BaseCommand):
    help = 'Seed initial coupons'

    def handle(self, *args, **kwargs):
        coupons = [
            {
                'code': 'WELCOME50',
                'discount_amount': 50.00,
                'min_order_value': 150.00,
                'valid_until': timezone.now() + timedelta(days=30)
            },
            {
                'code': 'ORGANIC20',
                'discount_amount': 20.00,
                'min_order_value': 100.00,
                'valid_until': timezone.now() + timedelta(days=7)
            },
            {
                'code': 'SAVE100',
                'discount_amount': 100.00,
                'min_order_value': 500.00,
                'valid_until': timezone.now() + timedelta(days=30)
            }
        ]

        for data in coupons:
            coupon, created = Coupon.objects.get_or_create(code=data['code'], defaults=data)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created coupon {data["code"]}'))
            else:
                self.stdout.write(self.style.WARNING(f'Coupon {data["code"]} already exists'))
