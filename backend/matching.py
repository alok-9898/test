"""Hybrid matching engine - keyword + semantic matching."""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, text
from sqlalchemy.orm import selectinload
from models import User, TalentProfile, StartupProfile, InvestorProfile, Embedding, UserRole
from typing import List, Dict, Optional
from openai import AsyncOpenAI
from config import settings
from datetime import datetime

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None


async def generate_embedding(text: str) -> List[float]:
    """Generate embedding using OpenAI text-embedding-3-small."""
    if not text or not client:
        return [0.0] * 1536
    
    try:
        response = await client.embeddings.create(
            model="text-embedding-3-small",
            input=text
        )
        return response.data[0].embedding
    except Exception as e:
        print(f"Error generating embedding: {e}")
        return [0.0] * 1536


async def store_embedding(db: AsyncSession, user_id: str, embedding: List[float], text_source: str):
    """Store or update embedding for a user."""
    from models import Embedding
    from uuid import UUID
    
    # Check if embedding exists
    result = await db.execute(
        select(Embedding).where(
            Embedding.user_id == UUID(user_id),
            Embedding.text_source == text_source
        )
    )
    existing = result.scalar_one_or_none()
    
    if existing:
        existing.embedding = embedding
        existing.created_at = datetime.utcnow().isoformat()
    else:
        new_embedding = Embedding(
            user_id=UUID(user_id),
            embedding=embedding,
            text_source=text_source,
            created_at=datetime.utcnow().isoformat()
        )
        db.add(new_embedding)
    
    await db.commit()


def calculate_jaccard_similarity(set1: List[str], set2: List[str]) -> float:
    """Calculate Jaccard similarity between two sets."""
    if not set1 or not set2:
        return 0.0
    
    set1_set = set(set1)
    set2_set = set(set2)
    
    intersection = len(set1_set & set2_set)
    union = len(set1_set | set2_set)
    
    if union == 0:
        return 0.0
    
    return intersection / union


async def match_talent_to_startup(
    db: AsyncSession,
    talent_id: str,
    startup_id: str
) -> Dict:
    """Match talent to a startup role using hybrid scoring."""
    from uuid import UUID
    
    # Get talent profile
    talent_result = await db.execute(
        select(TalentProfile).where(TalentProfile.user_id == UUID(talent_id))
    )
    talent = talent_result.scalar_one_or_none()
    
    # Get startup profile
    startup_result = await db.execute(
        select(StartupProfile).where(StartupProfile.user_id == UUID(startup_id))
    )
    startup = startup_result.scalar_one_or_none()
    
    if not talent or not startup:
        return {"error": "Profile not found"}
    
    # Score A: Keyword Match (60%)
    talent_skills = [s.get("name", "") for s in (talent.skills or [])]
    required_skills = startup.required_skills or []
    
    keyword_score = calculate_jaccard_similarity(talent_skills, required_skills)
    
    # Score B: Semantic Match (40%)
    # Get embeddings
    talent_embedding_result = await db.execute(
        select(Embedding).where(
            Embedding.user_id == UUID(talent_id),
            Embedding.text_source == "profile"
        )
    )
    talent_embedding = talent_embedding_result.scalar_one_or_none()
    
    startup_embedding_result = await db.execute(
        select(Embedding).where(
            Embedding.user_id == UUID(startup_id),
            Embedding.text_source == "profile"
        )
    )
    startup_embedding = startup_embedding_result.scalar_one_or_none()
    
    semantic_score = 0.0
    if talent_embedding and startup_embedding:
        # Calculate cosine similarity using pgvector
        cosine_query = text("""
            SELECT 1 - (t.embedding <=> s.embedding) as similarity
            FROM embeddings t, embeddings s
            WHERE t.user_id = :talent_id AND t.text_source = 'profile'
            AND s.user_id = :startup_id AND s.text_source = 'profile'
        """)
        result = await db.execute(
            cosine_query,
            {"talent_id": UUID(talent_id), "startup_id": UUID(startup_id)}
        )
        row = result.fetchone()
        if row:
            semantic_score = max(0.0, min(1.0, float(row[0])))
    
    # Final Score
    final_score = (keyword_score * 0.6) + (semantic_score * 0.4)
    
    # Determine matched and missing skills
    talent_skill_set = set(talent_skills)
    required_skill_set = set(required_skills)
    matched_skills = list(talent_skill_set & required_skill_set)
    missing_skills = list(required_skill_set - talent_skill_set)
    
    return {
        "user_id": str(startup.user_id),
        "match_percentage": round(final_score * 100, 2),
        "score_breakdown": {
            "skills": round(keyword_score, 2),
            "semantic": round(semantic_score, 2)
        },
        "matched_skills": matched_skills,
        "missing_skills": missing_skills
    }


async def match_startup_to_investor(
    db: AsyncSession,
    startup_id: str,
    investor_id: str
) -> Dict:
    """Match startup to investor using hybrid scoring."""
    from uuid import UUID
    
    # Get profiles
    startup_result = await db.execute(
        select(StartupProfile).where(StartupProfile.user_id == UUID(startup_id))
    )
    startup = startup_result.scalar_one_or_none()
    
    investor_result = await db.execute(
        select(InvestorProfile).where(InvestorProfile.user_id == UUID(investor_id))
    )
    investor = investor_result.scalar_one_or_none()
    
    if not startup or not investor:
        return {"error": "Profile not found"}
    
    # Score A: Keyword Match (60%)
    # Match industry to preferred sectors, stage to investment stage
    startup_industry = [startup.industry] if startup.industry else []
    preferred_sectors = investor.preferred_sectors or []
    
    industry_match = calculate_jaccard_similarity(startup_industry, preferred_sectors)
    
    startup_stage = [startup.stage.value] if startup.stage else []
    investor_stages = investor.investment_stage or []
    
    stage_match = calculate_jaccard_similarity(startup_stage, investor_stages)
    
    keyword_score = (industry_match + stage_match) / 2
    
    # Score B: Semantic Match (40%)
    startup_embedding_result = await db.execute(
        select(Embedding).where(
            Embedding.user_id == UUID(startup_id),
            Embedding.text_source == "profile"
        )
    )
    startup_embedding = startup_embedding_result.scalar_one_or_none()
    
    investor_embedding_result = await db.execute(
        select(Embedding).where(
            Embedding.user_id == UUID(investor_id),
            Embedding.text_source == "thesis"
        )
    )
    investor_embedding = investor_embedding_result.scalar_one_or_none()
    
    semantic_score = 0.0
    if startup_embedding and investor_embedding:
        cosine_query = text("""
            SELECT 1 - (s.embedding <=> i.embedding) as similarity
            FROM embeddings s, embeddings i
            WHERE s.user_id = :startup_id AND s.text_source = 'profile'
            AND i.user_id = :investor_id AND i.text_source = 'thesis'
        """)
        result = await db.execute(
            cosine_query,
            {"startup_id": UUID(startup_id), "investor_id": UUID(investor_id)}
        )
        row = result.fetchone()
        if row:
            semantic_score = max(0.0, min(1.0, float(row[0])))
    
    # Final Score
    final_score = (keyword_score * 0.6) + (semantic_score * 0.4)
    
    return {
        "user_id": str(investor.user_id),
        "match_percentage": round(final_score * 100, 2),
        "score_breakdown": {
            "industry_stage": round(keyword_score, 2),
            "semantic": round(semantic_score, 2)
        }
    }
