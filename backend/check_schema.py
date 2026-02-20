import asyncio
from sqlalchemy import text
from database import engine

async def check():
    async with engine.connect() as conn:
        for table in ["matches", "talent_profiles", "job_postings"]:
            print(f"\nColumns in {table}:")
            try:
                result = await conn.execute(text(f"DESCRIBE {table}"))
                for row in result.fetchall():
                    print(f"  {row[0]} ({row[1]})")
            except Exception as e:
                print(f"  Error checking {table}: {e}")

    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(check())
