import requests

# Test Register
res = requests.post("http://localhost:8000/api/v1/auth/register", json={
    "full_name": "Test User",
    "email": "test_user_123@example.com",
    "password": "password123"
})
print("Register Status:", res.status_code)
print("Register Response:", res.text)

# Test Login
res2 = requests.post("http://localhost:8000/api/v1/auth/login", data={
    "username": "test_user_123@example.com",
    "password": "password123"
})
print("Login Status:", res2.status_code)
print("Login Response:", res2.text)
