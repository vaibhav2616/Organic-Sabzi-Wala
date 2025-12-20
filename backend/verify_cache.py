import requests
import time

url = "http://localhost:8000/api/proxy/products/"

print("Request 1 (Uncached)...")
start = time.time()
try:
    r1 = requests.get(url)
    print(f"Status: {r1.status_code}, Time: {time.time() - start:.4f}s")
except Exception as e:
    print(f"Error: {e}")

print("\nRequest 2 (Cached)...")
start = time.time()
try:
    r2 = requests.get(url)
    print(f"Status: {r2.status_code}, Time: {time.time() - start:.4f}s")
except Exception as e:
    print(f"Error: {e}")

if r1.status_code == 200 and r2.status_code == 200:
    print("\nSUCCESS: Both requests succeeded.")
else:
    print("\nFAILURE: One or both requests failed.")
