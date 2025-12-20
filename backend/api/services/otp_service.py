import logging
import random
import uuid

# Configure OTP Logger
otp_logger = logging.getLogger('otp_debug')
handler = logging.FileHandler('otp_debug.log')
formatter = logging.Formatter('%(asctime)s - %(message)s')
handler.setFormatter(formatter)
otp_logger.addHandler(handler)
otp_logger.setLevel(logging.INFO)

class OTPService:
    @staticmethod
    def generate_otp(phone_number):
        """Generates a 6-digit OTP and logs it to file."""
        otp = str(random.randint(100000, 999999))
        # In prod, send via SMS
        otp_logger.info(f"OTP for {phone_number}: {otp}")
        print(f"DEBUG: OTP for {phone_number} is {otp}")
        return otp

    @staticmethod
    def verify_otp(sent_otp, user_input_otp):
        """Simple equality check. In prod, check cache/redis."""
        return sent_otp == user_input_otp

class PaymentGateway:
    @staticmethod
    def initiate_payment(amount, order_id):
        """Mock Payment Initialization Return."""
        # Simulate interaction with Razorpay/Stripe
        return {
            'transaction_id': f"txn_{uuid.uuid4().hex[:12]}",
            'provider': 'MockPay',
            'amount': amount,
            'status': 'INITIATED',
            'gateway_url': 'https://mock-gateway.com/pay'
        }

    @staticmethod
    def verify_payment_signature(payment_id, signature):
        """Mock Verification Logic."""
        # Assume valid for now
        return True
