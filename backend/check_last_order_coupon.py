import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import Order

def check_last_order():
    try:
        order = Order.objects.latest('created_at')
        print(f"Order ID: {order.id}")
        print(f"Total Price: {order.total_price}")
        print(f"Coupon: {order.coupon}")
        print(f"Discount Amount: {order.discount_amount}")
        
        if order.coupon and order.coupon.code == 'TEST50' and order.discount_amount == 50.00:
            print("SUCCESS: Coupon 'TEST50' applied and recorded correctly.")
        else:
            print("FAILURE: Coupon not recorded correctly.")
            
    except Order.DoesNotExist:
        print("No orders found.")

if __name__ == "__main__":
    check_last_order()
