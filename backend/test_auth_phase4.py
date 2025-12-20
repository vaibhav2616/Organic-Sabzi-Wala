import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from rest_framework.test import APIClient

def test_auth_flow():
    client = APIClient()
    print("Running Phase 4 Auth Tests...")

    phone = "9876543210"

    # 1. Send OTP
    print("\n[TEST] Send OTP")
    resp = client.post('/api/auth/otp/send/', {'phone_number': phone}, format='json')
    if resp.status_code == 200:
        data = resp.json() # Standard Renderer
        debug_otp = data['data']['debug_otp']
        print(f"[PASS] OTP Sent. Debug OTP: {debug_otp}")
        
        # 2. Verify OTP (Correct - Mock fixed)
        print("\n[TEST] Verify OTP (Success)")
        verify_resp = client.post('/api/auth/otp/verify/', {
            'phone_number': phone,
            'otp': '123456'
        }, format='json')
        
        if verify_resp.status_code == 200:
            v_data = verify_resp.json()
            access_token = v_data['data']['access']
            print(f"[PASS] Login Successful. Token: {access_token[:10]}...")
        else:
            print(f"[FAIL] OTP Verify Failed: {verify_resp.json()}")

        # 3. Verify OTP (Incorrect)
        print("\n[TEST] Verify OTP (Failure)")
        fail_resp = client.post('/api/auth/otp/verify/', {
            'phone_number': phone,
            'otp': '000000'
        }, format='json')
        if fail_resp.status_code == 400:
             print(f"[PASS] Invalid OTP Rejected correctly.")
        else:
             print(f"[FAIL] Invalid OTP accepted? {fail_resp.status_code}")

    else:
        print(f"[FAIL] Send OTP failed: {resp.json()}")

if __name__ == '__main__':
    test_auth_flow()
