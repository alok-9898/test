import asyncio
from sqlalchemy import select
from database import engine, AsyncSessionLocal
from models import TalentProfile, StartupProfile, Embedding

async def check_data():
    async with AsyncSessionLocal() as db:
        print("--- Talent Profiles ---")
        talent_result = await db.execute(select(TalentProfile))
        for t in talent_result.scalars().all():
            print(f"Name: {t.name}, Skills: {t.skills}")
            
        print("\n--- Startup Profiles ---")
        startup_result = await db.execute(select(StartupProfile))
        for s in startup_result.scalars().all():
            print(f"Name: {s.name}, Required Skills: {s.required_skills}, Tech Stack: {s.tech_stack}")
            
        print("\n--- Embeddings ---")
        emb_result = await db.execute(select(Embedding))
        for e in emb_result.scalars().all():
            print(f"User ID: {e.user_id}, Source: {e.text_source}")

if __name__ == "__main__":
    asyncio.run(check_data())
