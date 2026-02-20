"""Founder/Startup routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional, List, Dict
from database import get_db
from models import User, StartupProfile, UserRole
from dependencies import get_current_user
from matching import generate_embedding, store_embedding
from datetime import datetime
from uuid import UUID
from config import settings
from mock_data import MOCK_STARTUP_PROFILE, MOCK_USERS

router = APIRouter()


class StartupProfileUpdate(BaseModel):
    name: Optional[str] = None
    tagline: Optional[str] = None
    industry: Optional[str] = None
    stage: Optional[str] = None
    website: Optional[str] = None
    founding_year: Optional[int] = None
    mrr: Optional[float] = None
    user_count: Optional[int] = None
    growth_rate: Optional[float] = None
    funding_goal: Optional[float] = None
    equity_offered: Optional[float] = None
    use_of_funds: Optional[str] = None
    tech_stack: Optional[List[str]] = None
    required_skills: Optional[List[str]] = None
    problem_statement: Optional[str] = None
    team_members: Optional[List[Dict]] = None


@router.get("/profile")
async def get_startup_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get startup profile."""
    if current_user.role != UserRole.FOUNDER:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if settings.USE_MOCK_DATA:
        # Return mock profile
        return {
            "id": MOCK_STARTUP_PROFILE["id"],
            "user_id": MOCK_STARTUP_PROFILE["user_id"],
            "name": MOCK_STARTUP_PROFILE["name"],
            "tagline": MOCK_STARTUP_PROFILE["tagline"],
            "industry": MOCK_STARTUP_PROFILE["industry"],
            "stage": MOCK_STARTUP_PROFILE["stage"],
            "website": MOCK_STARTUP_PROFILE["website"],
            "founding_year": MOCK_STARTUP_PROFILE["founding_year"],
            "mrr": MOCK_STARTUP_PROFILE["mrr"],
            "user_count": MOCK_STARTUP_PROFILE["user_count"],
            "growth_rate": MOCK_STARTUP_PROFILE["growth_rate"],
            "funding_goal": MOCK_STARTUP_PROFILE["funding_goal"],
            "equity_offered": MOCK_STARTUP_PROFILE["equity_offered"],
            "use_of_funds": MOCK_STARTUP_PROFILE["use_of_funds"],
            "tech_stack": MOCK_STARTUP_PROFILE["tech_stack"],
            "required_skills": MOCK_STARTUP_PROFILE["required_skills"],
            "problem_statement": MOCK_STARTUP_PROFILE["problem_statement"],
            "team_members": MOCK_STARTUP_PROFILE["team_members"],
            "open_roles_count": MOCK_STARTUP_PROFILE["open_roles_count"],
            "completeness_score": MOCK_STARTUP_PROFILE["completeness_score"]
        }
    
    result = await db.execute(
        select(StartupProfile).where(StartupProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        return {"message": "Profile not created yet"}
    
    return {
        "id": str(profile.id),
        "user_id": str(profile.user_id),
        "name": profile.name,
        "tagline": profile.tagline,
        "industry": profile.industry,
        "stage": profile.stage.value if profile.stage else None,
        "website": profile.website,
        "founding_year": profile.founding_year,
        "mrr": profile.mrr,
        "user_count": profile.user_count,
        "growth_rate": profile.growth_rate,
        "funding_goal": profile.funding_goal,
        "equity_offered": profile.equity_offered,
        "use_of_funds": profile.use_of_funds,
        "tech_stack": profile.tech_stack,
        "required_skills": profile.required_skills,
        "problem_statement": profile.problem_statement,
        "team_members": profile.team_members,
        "open_roles_count": profile.open_roles_count,
        "completeness_score": profile.completeness_score
    }


@router.patch("/profile")
async def update_startup_profile(
    profile_data: StartupProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update startup profile."""
    if current_user.role != UserRole.FOUNDER:
        raise HTTPException(status_code=403, detail="Access denied")
    
    result = await db.execute(
        select(StartupProfile).where(StartupProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        # Create new profile
        profile = StartupProfile(user_id=current_user.id)
        db.add(profile)
    
    # Update fields
    update_data = profile_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(profile, key, value)
    
    profile.updated_at = datetime.utcnow().isoformat()
    
    # Calculate completeness score
    fields = ["name", "tagline", "industry", "stage", "problem_statement", 
              "funding_goal", "required_skills", "tech_stack"]
    filled = sum(1 for field in fields if getattr(profile, field))
    profile.completeness_score = (filled / len(fields)) * 100
    
    await db.commit()
    await db.refresh(profile)
    
    # Generate and store embedding
    profile_text = f"{profile.name or ''} {profile.tagline or ''} {profile.problem_statement or ''} {' '.join(profile.tech_stack or [])}"
    embedding = await generate_embedding(profile_text)
    await store_embedding(db, str(current_user.id), embedding, "profile")
    
    return {"message": "Profile updated", "completeness_score": profile.completeness_score}
