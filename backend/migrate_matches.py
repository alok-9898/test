import asyncio
from sqlalchemy import text
from database import engine

async def migrate():
    async with engine.begin() as conn:
        # Check and add columns to matches
        result = await conn.execute(text("DESCRIBE matches"))
        existing = [r[0] for r in result.fetchall()]
        
        if "job_id" not in existing:
            print("Adding job_id to matches...")
            # Using String(36) to match UUID length if it was String(36) in models.py
            await conn.execute(text("ALTER TABLE matches ADD COLUMN job_id VARCHAR(36)"))
            await conn.execute(text("ALTER TABLE matches ADD CONSTRAINT fk_match_job FOREIGN KEY (job_id) REFERENCES job_postings(id)"))
        else:
            print("  job_id already exists in matches.")

    await engine.dispose()
    print("Migration complete.")

if __name__ == "__main__":
    asyncio.run(migrate())
