import asyncio
from sqlalchemy import text
from database import engine

async def check():
    async with engine.connect() as conn:
        tables = [
            ("startup_profiles", "user_id"),
            ("job_postings", "id"),
            ("talent_profiles", "user_id"),
            ("embeddings", "user_id, text_source")
        ]
        
        for table, col in tables:
            print(f"\nChecking duplicates in {table} (by {col}):")
            query = f"SELECT {col}, COUNT(*) FROM {table} GROUP BY {col} HAVING COUNT(*) > 1"
            result = await conn.execute(text(query))
            rows = result.fetchall()
            if not rows:
                print("  Clean.")
            for row in rows:
                print(f"  Duplicate found: {row[0]}, Count: {row[1]}")

    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(check())
