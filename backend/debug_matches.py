import asyncio
import json
from sqlalchemy import select
from database import get_db
from models import StartupProfile, TalentProfile, User, JobPosting
from matching import match_talent_to_startup

async def debug_matches():
    async for db in get_db():
        # Get all users to find the one the user is likely using
        users_result = await db.execute(select(User))
        users = users_result.scalars().all()
        
        talent_result = await db.execute(select(TalentProfile))
        all_talent = talent_result.scalars().all()
        
        output = []
        output.append(f"Total Users: {len(users)}")
        output.append(f"Total Talent Profiles: {len(all_talent)}")
        
        for u in users:
            if u.role == "FOUNDER":
                startup_result = await db.execute(select(StartupProfile).where(StartupProfile.user_id == u.id))
                startup = startup_result.scalars().first()
                
                output.append(f"\n--- Founder: {u.email} ---")
                if not startup:
                    output.append("  NO Startup Profile")
                    continue
                
                output.append(f"  Startup Name: {startup.name}")
                output.append(f"  Startup Required Skills: {startup.required_skills}")
                
                jobs_result = await db.execute(select(JobPosting).where(JobPosting.startup_id == startup.id))
                jobs = jobs_result.scalars().all()
                output.append(f"  Job Postings: {len(jobs)}")
                for j in jobs:
                    output.append(f"    - {j.title}: {j.required_skills}")
                
                for t in all_talent:
                    match = await match_talent_to_startup(db, t.user_id, u.id)
                    output.append(f"  Match with {t.name}: {match.get('match_percentage')}%")
                    output.append(f"    - Talent Skills: {t.skills}")

        with open("debug_log.txt", "w", encoding="utf-8") as f:
            f.write("\n".join(output))

if __name__ == "__main__":
    asyncio.run(debug_matches())
