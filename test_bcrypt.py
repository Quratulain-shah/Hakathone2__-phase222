"""
Test script to isolate bcrypt issue
"""
import sys
sys.path.append('backend')

from backend.utils import get_password_hash, verify_password

def test_bcrypt():
    print("Testing bcrypt functionality...")
    try:
        password = "test123"
        print(f"Attempting to hash password: {password}")
        hashed = get_password_hash(password)
        print(f"Successfully hashed: {hashed[:50]}...")

        # Test verification
        is_valid = verify_password(password, hashed)
        print(f"Password verification: {is_valid}")

        print("✅ Bcrypt is working correctly!")
    except Exception as e:
        print(f"❌ Bcrypt error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_bcrypt()