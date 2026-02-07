"""
Test script to check database operations
"""
import asyncio
import sys
sys.path.append('backend')

from backend.database import get_async_session
from backend.models.user import User
from backend.utils import get_password_hash

async def test_db():
    print("Testing database operations...")

    async for session in get_async_session():
        try:
            # Create a test user directly
            hashed_password = get_password_hash("testpass123")
            user = User(
                email="test@example.com",
                hashed_password=hashed_password
            )

            session.add(user)
            await session.commit()
            await session.refresh(user)

            print(f"User created successfully: {user.email}, ID: {user.id}")

            # Query the user back
            from sqlmodel import select
            result = await session.execute(select(User).where(User.email == "test@example.com"))
            found_user = result.scalar_one_or_none()

            if found_user:
                print(f"User found: {found_user.email}")
            else:
                print("User not found in database")

        except Exception as e:
            print(f"Database error: {e}")
            import traceback
            traceback.print_exc()
        finally:
            await session.aclose()

if __name__ == "__main__":
    asyncio.run(test_db())