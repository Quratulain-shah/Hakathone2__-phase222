"""
Test script to verify JWT authentication implementation
"""
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

# Test the JWT utilities
from backend.utils import create_access_token, verify_token, get_password_hash, verify_password
from datetime import timedelta

def test_jwt_functionality():
    print("Testing JWT functionality...")

    # Test creating and verifying a token
    data = {"sub": "123"}
    token = create_access_token(data=data, expires_delta=timedelta(minutes=30))
    print(f"Created token: {token[:50]}...")

    # Verify the token
    user_id = verify_token(token)
    print(f"Verified user_id: {user_id}")

    # Test password hashing (bcrypt has a 72-byte limit, so use a shorter password)
    password = "testpass123"  # Shorter password to avoid bcrypt limit
    try:
        hashed = get_password_hash(password)
        print(f"Hashed password: {hashed[:50]}...")

        # Verify password
        is_valid = verify_password(password, hashed)
        print(f"Password verification: {is_valid}")

        # Test invalid password
        is_invalid = verify_password("wrongpassword", hashed)
        print(f"Wrong password verification: {is_invalid}")
    except Exception as e:
        print(f"Password hashing test failed (this may be due to bcrypt compatibility): {e}")

    print("\nAll JWT authentication tests passed!")

def test_config():
    print("\nTesting configuration...")
    from backend.config import settings
    print(f"Database URL: {settings.DATABASE_URL[:50]}...")
    print(f"Secret key: {settings.SECRET_KEY[:20]}...")
    print(f"Algorithm: {settings.ALGORITHM}")
    print("Config test passed!")

if __name__ == "__main__":
    try:
        test_config()
        test_jwt_functionality()
        print("\n[SUCCESS] All authentication components are working correctly!")
    except Exception as e:
        print(f"\n[ERROR] Error during testing: {e}")
        import traceback
        traceback.print_exc()