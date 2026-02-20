import asyncio
import sys
import os
from sqlalchemy import text

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from database import engine, AsyncSessionLocal

async def wipe_db():
    print("🧹 Wiping all data from database...")
    async with engine.begin() as conn:
        # Disable foreign key checks to allow truncation
        await conn.execute(text("SET FOREIGN_KEY_CHECKS = 0;"))
        
        # Get all table names
        result = await conn.execute(text("SHOW TABLES;"))
        tables = [row[0] for row in result.fetchall()]
        
        for table in tables:
            print(f"🗑️ Clearing table: {table}")
            await conn.execute(text(f"TRUNCATE TABLE {table};"))
            
        # Re-enable foreign key checks
        await conn.execute(text("SET FOREIGN_KEY_CHECKS = 1;"))
        print("✅ Database wiped successfully!")

if __name__ == "__main__":
    asyncio.run(wipe_db())
