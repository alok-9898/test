// Mock data for frontend-only mode
export const MOCK_USERS = {
  "founder@neplaunch.com": {
    id: "founder-123",
    email: "founder@neplaunch.com",
    password: "password123",
    role: "FOUNDER",
  },
  "talent@neplaunch.com": {
    id: "talent-123",
    email: "talent@neplaunch.com",
    password: "password123",
    role: "TALENT",
  },
  "investor@neplaunch.com": {
    id: "investor-123",
    email: "investor@neplaunch.com",
    password: "password123",
    role: "INVESTOR",
  },
};

export const MOCK_STARTUP_PROFILE = {
  id: "startup-123",
  user_id: "founder-123",
  name: "TechNepal Solutions",
  tagline: "Building the future of Nepal's tech ecosystem",
  industry: "SaaS",
  stage: "seed",
  website: "https://technepal.com",
  founding_year: 2023,
  mrr: 5000.0,
  user_count: 150,
  growth_rate: 25.5,
  funding_goal: 500000.0,
  equity_offered: 15.0,
  use_of_funds: "Product development, team expansion, marketing",
  tech_stack: ["React", "Python", "PostgreSQL", "AWS"],
  required_skills: ["Full-stack development", "Product design", "DevOps"],
  problem_statement: "Nepal's startups lack access to quality talent and investors",
  team_members: [
    { name: "John Doe", role: "CEO" },
    { name: "Jane Smith", role: "CTO" },
  ],
  open_roles_count: 3,
  completeness_score: 85.0,
};

export const MOCK_TALENT_PROFILE = {
  id: "talent-profile-123",
  user_id: "talent-123",
  name: "Raj Kumar",
  headline: "Full-stack Developer | React & Python",
  location: "Kathmandu, Nepal",
  skills: [
    { name: "React", proficiency: "Expert" },
    { name: "Python", proficiency: "Expert" },
    { name: "PostgreSQL", proficiency: "Intermediate" },
    { name: "AWS", proficiency: "Intermediate" },
    { name: "Product Design", proficiency: "Beginner" },
  ],
  bio: "Passionate developer with 3+ years of experience building web applications. Looking to join an early-stage startup.",
  experience_level: "mid",
  engagement_preferences: ["full-time", "part-time"],
  compensation_min: 50000,
  compensation_max: 80000,
  portfolio_links: [
    { type: "GitHub", url: "https://github.com/rajkumar" },
    { type: "Portfolio", url: "https://rajkumar.dev" },
  ],
  education: {
    institution: "Tribhuvan University",
    program: "Computer Engineering",
    graduation_year: 2021,
  },
  completeness_score: 90.0,
};

export const MOCK_INVESTOR_PROFILE = {
  id: "investor-profile-123",
  user_id: "investor-123",
  name: "Dr. Sarah Johnson",
  fund: "Nepal Ventures",
  type: "vc",
  investment_stage: ["pre-seed", "seed", "series-a"],
  thesis_text: "We invest in early-stage startups in Nepal focusing on SaaS, Fintech, and EdTech. We look for strong teams with product-market fit and scalable business models.",
  preferred_sectors: ["SaaS", "Fintech", "EdTech", "Healthcare"],
  check_size_min: 50000.0,
  check_size_max: 500000.0,
  geography_focus: "Nepal + South Asia",
  key_signals: ["strong team", "B2B SaaS", "social impact", "scalable model"],
  completeness_score: 88.0,
};

export const MOCK_TALENT_MATCHES = [
  {
    talent_id: "talent-123",
    name: "Raj Kumar",
    headline: "Full-stack Developer | React & Python",
    match_percentage: 87.5,
    score_breakdown: {
      skills: 0.72,
      semantic: 0.91,
    },
    matched_skills: ["React", "Python", "PostgreSQL", "AWS"],
    missing_skills: ["Product Design"],
  },
  {
    talent_id: "talent-456",
    name: "Priya Sharma",
    headline: "UI/UX Designer | Product Design",
    match_percentage: 65.0,
    score_breakdown: {
      skills: 0.50,
      semantic: 0.75,
    },
    matched_skills: ["Product Design"],
    missing_skills: ["React", "Python", "PostgreSQL", "AWS"],
  },
];

export const MOCK_INVESTOR_MATCHES = [
  {
    investor_id: "investor-123",
    name: "Dr. Sarah Johnson",
    fund: "Nepal Ventures",
    type: "vc",
    match_percentage: 82.0,
    score_breakdown: {
      industry_stage: 0.75,
      semantic: 0.88,
    },
  },
];

export const MOCK_STARTUP_MATCHES = [
  {
    startup_id: "startup-123",
    name: "TechNepal Solutions",
    tagline: "Building the future of Nepal's tech ecosystem",
    industry: "SaaS",
    match_percentage: 87.5,
    score_breakdown: {
      skills: 0.72,
      semantic: 0.91,
    },
    matched_skills: ["React", "Python", "PostgreSQL", "AWS"],
    missing_skills: ["Product Design"],
  },
];
