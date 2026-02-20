"""Matching routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from pydantic import BaseModel
from typing import List
from database import get_db
from models import User, Match, MatchStatus, TalentProfile, StartupProfile, InvestorProfile, UserRole, JobPosting
from dependencies import get_current_user
from matching import match_talent_to_startup, match_startup_to_investor
from datetime import datetime
from uuid import UUID
from config import settings
from mock_data import MOCK_TALENT_MATCHES, MOCK_INVESTOR_MATCHES, MOCK_STARTUP_MATCHES

router = APIRouter()


class ConnectionRequest(BaseModel):
    target_id: str
    message: str


@router.get("/talent")
async def get_talent_matches(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get matched talent for founder's startup."""
    if current_user.role != UserRole.FOUNDER:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if settings.USE_MOCK_DATA:
        return MOCK_TALENT_MATCHES
    
    # Get all talent profiles
    talent_result = await db.execute(select(TalentProfile))
    all_talent = talent_result.scalars().all()
    
    # Get startup profile
    startup_result = await db.execute(
        select(StartupProfile).where(StartupProfile.user_id == current_user.id)
    )
    startup = startup_result.scalar_one_or_none()
    
    if not startup:
        return []
    
    matches = []
    for talent in all_talent:
        match_result = await match_talent_to_startup(db, str(talent.user_id), str(current_user.id))
        if "error" not in match_result:
            matches.append({
                "talent_id": str(talent.user_id),
                "name": talent.name,
                "headline": talent.headline,
                **match_result
            })
    
    # Sort by match percentage
    matches.sort(key=lambda x: x["match_percentage"], reverse=True)
    
    return matches


@router.get("/investors")
async def get_investor_matches(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get matched investors for founder's startup."""
    if current_user.role != UserRole.FOUNDER:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if settings.USE_MOCK_DATA:
        return MOCK_INVESTOR_MATCHES
    
    # Get all investor profiles
    investor_result = await db.execute(select(InvestorProfile))
    all_investors = investor_result.scalars().all()
    
    matches = []
    for investor in all_investors:
        match_result = await match_startup_to_investor(db, str(current_user.id), str(investor.user_id))
        if "error" not in match_result:
            matches.append({
                "investor_id": str(investor.user_id),
                "name": investor.name,
                "fund": investor.fund,
                "type": investor.type,
                **match_result
            })
    
    matches.sort(key=lambda x: x["match_percentage"], reverse=True)
    
    return matches


@router.get("/startups")
async def get_startup_matches(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get matched startups for talent."""
    if current_user.role != UserRole.TALENT:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if settings.USE_MOCK_DATA:
        return MOCK_STARTUP_MATCHES
    
    startup_result = await db.execute(select(StartupProfile))
    all_startups = startup_result.scalars().all()
    
    matches = []
    for startup in all_startups:
        match_result = await match_talent_to_startup(db, str(current_user.id), str(startup.user_id))
        if "error" not in match_result:
            matches.append({
                "startup_id": str(startup.user_id),
                "name": startup.name,
                "tagline": startup.tagline,
                "industry": startup.industry,
                **match_result
            })
    
    matches.sort(key=lambda x: x["match_percentage"], reverse=True)
    
    return matches


@router.post("/connections/request")
async def request_connection(
    request: ConnectionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Send a connection request."""
    new_match = Match(
        requester_id=current_user.id,
        target_id=request.target_id,
        message=request.message,
        status=MatchStatus.PENDING,
        created_at=datetime.utcnow().isoformat()
    )
    
    db.add(new_match)
    await db.commit()
    await db.refresh(new_match)
    
    return {"message": "Connection request sent", "match_id": str(new_match.id)}


@router.get("/jobs")
async def get_job_matches(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get matched jobs for talent, ranked by skill overlap."""
    if current_user.role != UserRole.TALENT:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if settings.USE_MOCK_DATA:
        return MOCK_STARTUP_MATCHES
    
    # Get talent profile to extract skills
    talent_result = await db.execute(
        select(TalentProfile).where(TalentProfile.user_id == current_user.id)
    )
    talent = talent_result.scalar_one_or_none()
    talent_skills = set()
    if talent and talent.skills:
        # skills is [{name: str, proficiency: str}, ...]
        talent_skills = {s["name"].lower() for s in talent.skills if isinstance(s, dict) and "name" in s}

    result = await db.execute(
        select(JobPosting).options(joinedload(JobPosting.startup))
    )
    all_jobs = result.scalars().all()
    
    matches = []
    for job in all_jobs:
        # Calculate skill overlap
        job_skills = set(s.lower() for s in (job.required_skills or []))
        if job_skills and talent_skills:
            overlap = len(talent_skills & job_skills)
            skill_score = min(100, int((overlap / len(job_skills)) * 100))
        else:
            skill_score = 50  # neutral score if no skills defined
        
        matches.append({
            "job_id": str(job.id),
            "startup_id": str(job.startup.id),
            "title": job.title,
            "description": job.description,
            "location": job.location,
            "job_type": job.job_type,
            "compensation": job.compensation,
            "required_skills": job.required_skills or [],
            "startup_name": job.startup.name,
            "industry": job.startup.industry,
            "match_percentage": skill_score,
        })
    
    # Sort by skill match score descending
    matches.sort(key=lambda x: x["match_percentage"], reverse=True)
    return matches


@router.get("/connections")
async def get_connections(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all connections (sent and received)."""
    sent_result = await db.execute(
        select(Match).where(Match.requester_id == current_user.id)
    )
    sent = sent_result.scalars().all()
    
    received_result = await db.execute(
        select(Match).where(Match.target_id == current_user.id)
    )
    received = received_result.scalars().all()
    
    return {
        "sent": [{
            "id": str(m.id),
            "target_id": str(m.target_id),
            "status": m.status.value,
            "message": m.message,
            "created_at": m.created_at
        } for m in sent],
        "received": [{
            "id": str(m.id),
            "requester_id": str(m.requester_id),
            "status": m.status.value,
            "message": m.message,
            "created_at": m.created_at
        } for m in received]
    }
