import asyncio
from sqlalchemy import text
from database import engine

async def migrate():
    async with engine.begin() as conn:
        # Check and add columns to job_postings
        result = await conn.execute(text("DESCRIBE job_postings"))
        existing = [r[0] for r in result.fetchall()]
        
        cols = {
            "required_skills": "JSON",
            "updated_at": "VARCHAR(50)"
        }
        for col, col_type in cols.items():
            if col not in existing:
                print(f"Adding {col} to job_postings...")
                await conn.execute(text(f"ALTER TABLE job_postings ADD COLUMN {col} {col_type}"))
            else:
                print(f"  {col} already exists.")

    await engine.dispose()
    print("Migration complete.")

if __name__ == "__main__":
    asyncio.run(migrate())
