import asyncio
from sqlalchemy import text
from database import engine

async def migrate():
    async with engine.begin() as conn:
        # Check and add columns to matches
        result = await conn.execute(text("DESCRIBE matches"))
        existing_matches = [r[0] for r in result.fetchall()]
        
        if "job_id" not in existing_matches:
            print("Adding job_id to matches...")
            try:
                await conn.execute(text("ALTER TABLE matches ADD COLUMN job_id VARCHAR(36)"))
                await conn.execute(text("ALTER TABLE matches ADD CONSTRAINT fk_match_job FOREIGN KEY (job_id) REFERENCES job_postings(id)"))
            except Exception as e:
                print(f"  Error adding job_id: {e}")
        else:
            print("  job_id already exists in matches.")

        # Check and add columns to talent_profiles
        result = await conn.execute(text("DESCRIBE talent_profiles"))
        existing_talent = [r[0] for r in result.fetchall()]
        
        if "cv_path" not in existing_talent:
            print("Adding cv_path to talent_profiles...")
            await conn.execute(text("ALTER TABLE talent_profiles ADD COLUMN cv_path VARCHAR(500)"))
        else:
            print("  cv_path already exists in talent_profiles.")

    await engine.dispose()
    print("Migration complete.")

if __name__ == "__main__":
    asyncio.run(migrate())
