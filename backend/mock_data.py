"""Mock data for development and testing."""
from datetime import datetime
from uuid import uuid4

# Mock users
MOCK_USERS = {
    "founder@neplaunch.com": {
        "id": str(uuid4()),
        "email": "founder@neplaunch.com",
        "password": "password123",  # Will be hashed
        "role": "FOUNDER",
        "profile_data": {}
    },
    "talent@neplaunch.com": {
        "id": str(uuid4()),
        "email": "talent@neplaunch.com",
        "password": "password123",
        "role": "TALENT",
        "profile_data": {}
    },
    "investor@neplaunch.com": {
        "id": str(uuid4()),
        "email": "investor@neplaunch.com",
        "password": "password123",
        "role": "INVESTOR",
        "profile_data": {}
    },
}

# Mock startup profile
MOCK_STARTUP_PROFILE = {
    "id": str(uuid4()),
    "user_id": MOCK_USERS["founder@neplaunch.com"]["id"],
    "name": "TechNepal Solutions",
    "tagline": "Building the future of Nepal's tech ecosystem",
    "industry": "SaaS",
    "stage": "seed",
    "website": "https://technepal.com",
    "founding_year": 2023,
    "mrr": 5000.0,
    "user_count": 150,
    "growth_rate": 25.5,
    "funding_goal": 500000.0,
    "equity_offered": 15.0,
    "use_of_funds": "Product development, team expansion, marketing",
    "tech_stack": ["React", "Python", "PostgreSQL", "AWS"],
    "required_skills": ["Full-stack development", "Product design", "DevOps"],
    "problem_statement": "Nepal's startups lack access to quality talent and investors",
    "team_members": [
        {"name": "John Doe", "role": "CEO"},
        {"name": "Jane Smith", "role": "CTO"}
    ],
    "open_roles_count": 3,
    "completeness_score": 85.0,
    "updated_at": datetime.utcnow().isoformat()
}

# Mock talent profile
MOCK_TALENT_PROFILE = {
    "id": str(uuid4()),
    "user_id": MOCK_USERS["talent@neplaunch.com"]["id"],
    "name": "Raj Kumar",
    "headline": "Full-stack Developer | React & Python",
    "location": "Kathmandu, Nepal",
    "skills": [
        {"name": "React", "proficiency": "Expert"},
        {"name": "Python", "proficiency": "Expert"},
        {"name": "PostgreSQL", "proficiency": "Intermediate"},
        {"name": "AWS", "proficiency": "Intermediate"},
        {"name": "Product Design", "proficiency": "Beginner"}
    ],
    "bio": "Passionate developer with 3+ years of experience building web applications. Looking to join an early-stage startup.",
    "experience_level": "mid",
    "engagement_preferences": ["full-time", "part-time"],
    "compensation_min": 50000,
    "compensation_max": 80000,
    "portfolio_links": [
        {"type": "GitHub", "url": "https://github.com/rajkumar"},
        {"type": "Portfolio", "url": "https://rajkumar.dev"}
    ],
    "education": {
        "institution": "Tribhuvan University",
        "program": "Computer Engineering",
        "graduation_year": 2021
    },
    "completeness_score": 90.0,
    "updated_at": datetime.utcnow().isoformat()
}

# Mock investor profile
MOCK_INVESTOR_PROFILE = {
    "id": str(uuid4()),
    "user_id": MOCK_USERS["investor@neplaunch.com"]["id"],
    "name": "Dr. Sarah Johnson",
    "fund": "Nepal Ventures",
    "type": "vc",
    "investment_stage": ["pre-seed", "seed", "series-a"],
    "thesis_text": "We invest in early-stage startups in Nepal focusing on SaaS, Fintech, and EdTech. We look for strong teams with product-market fit and scalable business models.",
    "preferred_sectors": ["SaaS", "Fintech", "EdTech", "Healthcare"],
    "check_size_min": 50000.0,
    "check_size_max": 500000.0,
    "geography_focus": "Nepal + South Asia",
    "key_signals": ["strong team", "B2B SaaS", "social impact", "scalable model"],
    "completeness_score": 88.0,
    "updated_at": datetime.utcnow().isoformat()
}

# Mock talent matches (for founder)
MOCK_TALENT_MATCHES = [
    {
        "talent_id": MOCK_TALENT_PROFILE["user_id"],
        "name": "Raj Kumar",
        "headline": "Full-stack Developer | React & Python",
        "match_percentage": 87.5,
        "score_breakdown": {
            "skills": 0.72,
            "semantic": 0.91
        },
        "matched_skills": ["React", "Python", "PostgreSQL", "AWS"],
        "missing_skills": ["Product Design"]
    },
    {
        "talent_id": str(uuid4()),
        "name": "Priya Sharma",
        "headline": "UI/UX Designer | Product Design",
        "match_percentage": 65.0,
        "score_breakdown": {
            "skills": 0.50,
            "semantic": 0.75
        },
        "matched_skills": ["Product Design"],
        "missing_skills": ["React", "Python", "PostgreSQL", "AWS"]
    }
]

# Mock investor matches (for founder)
MOCK_INVESTOR_MATCHES = [
    {
        "investor_id": MOCK_INVESTOR_PROFILE["user_id"],
        "name": "Dr. Sarah Johnson",
        "fund": "Nepal Ventures",
        "type": "vc",
        "match_percentage": 82.0,
        "score_breakdown": {
            "industry_stage": 0.75,
            "semantic": 0.88
        }
    }
]

# Mock startup matches (for talent)
MOCK_STARTUP_MATCHES = [
    {
        "startup_id": MOCK_STARTUP_PROFILE["user_id"],
        "name": "TechNepal Solutions",
        "tagline": "Building the future of Nepal's tech ecosystem",
        "industry": "SaaS",
        "match_percentage": 87.5,
        "score_breakdown": {
            "skills": 0.72,
            "semantic": 0.91
        },
        "matched_skills": ["React", "Python", "PostgreSQL", "AWS"],
        "missing_skills": ["Product Design"]
    }
]

# Mock pitch feedback
MOCK_PITCH_FEEDBACK = {
    "market_size_score": 8,
    "market_size_feedback": "The Nepal market shows strong potential with growing internet penetration. However, consider expanding to South Asian markets for scalability.",
    "team_market_fit_score": 7,
    "team_market_fit_feedback": "Your team has strong technical skills. Consider adding a sales/marketing lead to accelerate growth.",
    "traction_narrative_score": 6,
    "traction_narrative_feedback": "Good early traction with 150 users. Focus on demonstrating consistent growth and retention metrics.",
    "defensibility_score": 7,
    "defensibility_feedback": "Your tech stack and approach are solid. Consider building network effects or proprietary data moats.",
    "overall_assessment": "Strong early-stage startup with good potential. Focus on scaling user acquisition and building a sustainable business model.",
    "suggestions": [
        "Expand market size narrative to include South Asia",
        "Add sales/marketing expertise to the team",
        "Demonstrate stronger growth metrics",
        "Build competitive moats"
    ]
}

# Mock team gap analysis
MOCK_TEAM_GAP_ANALYSIS = {
    "gaps": [
        {
            "role": "CFO/Finance Lead",
            "impact": "High",
            "reason": "Investors require financial planning and reporting capabilities",
            "recommended_action": "Post a role for Finance Lead"
        },
        {
            "role": "Sales/Marketing Lead",
            "impact": "Critical",
            "reason": "Needed to accelerate user acquisition and revenue growth",
            "recommended_action": "Post a role for Sales Lead"
        }
    ],
    "investor_readiness_score": 65,
    "recommendations": [
        "Add a CFO to improve investor confidence",
        "Strengthen sales/marketing team to demonstrate growth potential",
        "Build financial reporting capabilities"
    ]
}
