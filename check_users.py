import asyncio
import sys
import os
from sqlalchemy import text

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from database import engine

async def check_db():
    print("Checking users table...")
    try:
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT id, email, role FROM users;"))
            rows = result.fetchall()
            print(f"Found {len(rows)} users:")
            for row in rows:
                print(f" - ID: {row[0]}, Email: {row[1]}, Role: {row[2]}")
    except Exception as e:
        print(f"Error checking database: {e}")

if __name__ == "__main__":
    asyncio.run(check_db())
