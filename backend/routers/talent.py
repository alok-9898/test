"""Talent routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional, List, Dict
from database import get_db
from models import User, TalentProfile, UserRole
from dependencies import get_current_user
from matching import generate_embedding, store_embedding
from datetime import datetime
from config import settings
from mock_data import MOCK_TALENT_PROFILE

router = APIRouter()


class TalentProfileUpdate(BaseModel):
    name: Optional[str] = None
    headline: Optional[str] = None
    location: Optional[str] = None
    skills: Optional[List[Dict]] = None  # [{name: str, proficiency: str}]
    bio: Optional[str] = None
    experience_level: Optional[str] = None
    engagement_preferences: Optional[List[str]] = None
    compensation_min: Optional[int] = None
    compensation_max: Optional[int] = None
    portfolio_links: Optional[List[Dict]] = None
    education: Optional[Dict] = None


@router.get("/profile")
async def get_talent_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get talent profile."""
    if current_user.role != UserRole.TALENT:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if settings.USE_MOCK_DATA:
        return {
            "id": MOCK_TALENT_PROFILE["id"],
            "user_id": MOCK_TALENT_PROFILE["user_id"],
            "name": MOCK_TALENT_PROFILE["name"],
            "headline": MOCK_TALENT_PROFILE["headline"],
            "location": MOCK_TALENT_PROFILE["location"],
            "skills": MOCK_TALENT_PROFILE["skills"],
            "bio": MOCK_TALENT_PROFILE["bio"],
            "experience_level": MOCK_TALENT_PROFILE["experience_level"],
            "engagement_preferences": MOCK_TALENT_PROFILE["engagement_preferences"],
            "compensation_min": MOCK_TALENT_PROFILE["compensation_min"],
            "compensation_max": MOCK_TALENT_PROFILE["compensation_max"],
            "portfolio_links": MOCK_TALENT_PROFILE["portfolio_links"],
            "education": MOCK_TALENT_PROFILE["education"],
            "completeness_score": MOCK_TALENT_PROFILE["completeness_score"]
        }
    
    result = await db.execute(
        select(TalentProfile).where(TalentProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        return {"message": "Profile not created yet"}
    
    return {
        "id": str(profile.id),
        "user_id": str(profile.user_id),
        "name": profile.name,
        "headline": profile.headline,
        "location": profile.location,
        "skills": profile.skills,
        "bio": profile.bio,
        "experience_level": profile.experience_level,
        "engagement_preferences": profile.engagement_preferences,
        "compensation_min": profile.compensation_min,
        "compensation_max": profile.compensation_max,
        "portfolio_links": profile.portfolio_links,
        "education": profile.education,
        "completeness_score": profile.completeness_score
    }


@router.patch("/profile")
async def update_talent_profile(
    profile_data: TalentProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update talent profile."""
    if current_user.role != UserRole.TALENT:
        raise HTTPException(status_code=403, detail="Access denied")
    
    result = await db.execute(
        select(TalentProfile).where(TalentProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        profile = TalentProfile(user_id=current_user.id)
        db.add(profile)
    
    # Update fields
    update_data = profile_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(profile, key, value)
    
    profile.updated_at = datetime.utcnow().isoformat()
    
    # Calculate completeness score
    fields = ["name", "headline", "skills", "bio", "experience_level", 
              "engagement_preferences", "education"]
    filled = sum(1 for field in fields if getattr(profile, field))
    profile.completeness_score = (filled / len(fields)) * 100
    
    await db.commit()
    await db.refresh(profile)
    
    # Generate and store embedding
    skill_names = [s.get("name", "") for s in (profile.skills or [])]
    profile_text = f"{profile.name or ''} {profile.headline or ''} {profile.bio or ''} {' '.join(skill_names)}"
    embedding = await generate_embedding(profile_text)
    await store_embedding(db, str(current_user.id), embedding, "profile")
    
    return {"message": "Profile updated", "completeness_score": profile.completeness_score}
