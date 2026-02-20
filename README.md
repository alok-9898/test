# NepLaunch - Startup Marketplace for Nepal

A three-sided platform connecting Founders, Talent, and Investors in Nepal's startup ecosystem.

## 🏗️ Architecture

- **Backend**: FastAPI (Python 3.11+) with async PostgreSQL + pgvector
- **Frontend**: React + Vite + Tailwind CSS
- **Database**: PostgreSQL 15+ with pgvector extension
- **AI**: OpenAI API for embeddings and pitch feedback
- **Deployment**: AWS Free Tier (EC2, RDS, S3, CloudFront)

## 🚀 Quick Start

### Option 1: Mock Data Mode (No Database Required) ⚡

**Fastest way to get started!**

1. Install backend dependencies:
```bash
cd backend
pip install -r ../requirements.txt
python run.py
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
npm run dev
```

3. Login with demo accounts:
   - **Founder**: `founder@neplaunch.com` / `password123`
   - **Talent**: `talent@neplaunch.com` / `password123`
   - **Investor**: `investor@neplaunch.com` / `password123`

See `backend/README_MOCK_DATA.md` for more details.

### Option 2: Real Database Setup

1. Install dependencies:
```bash
cd backend
pip install -r ../requirements.txt
```

2. Set up environment variables:
```bash
cp ../.env.example .env
# Edit .env with your credentials
# Set USE_MOCK_DATA=False
```

3. Initialize database:
```bash
# Make sure PostgreSQL is running with pgvector extension
python run.py
```

4. Run backend:
```bash
cd backend
python run.py
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Set up environment:
```bash
# Create .env file
echo "VITE_API_URL=http://localhost:8000" > .env
```

3. Run frontend:
```bash
npm run dev
```

## 📁 Project Structure

```
.
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Configuration settings
│   ├── database.py          # Database connection
│   ├── models.py            # SQLAlchemy models
│   ├── auth.py              # Authentication utilities
│   ├── matching.py          # Hybrid matching engine
│   └── routers/
│       ├── auth.py          # Auth routes
│       ├── founders.py      # Founder/Startup routes
│       ├── talent.py        # Talent routes
│       ├── investors.py     # Investor routes
│       ├── matches.py       # Matching routes
│       └── ai.py            # AI features
├── frontend/
│   ├── src/
│   │   ├── api/             # API client functions
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   └── pages/           # Page components
│   └── vite.config.js
├── requirements.txt
├── package.json
└── .env.example
```

## 🔑 Key Features

### Hybrid Matching Engine
- **60% Keyword Match**: Jaccard similarity on skills/industries
- **40% Semantic Match**: Cosine similarity using OpenAI embeddings

### AI Features
- Pitch Co-Pilot: Get feedback on your pitch from a Kathmandu-based investor perspective
- Team Gap Analysis: Identify missing critical roles

### Three-Sided Platform
- **Founders**: Post roles, find talent, connect with investors
- **Talent**: Browse opportunities, see match scores, apply to roles
- **Investors**: Define thesis, view deal flow, track portfolio

## 🔐 Environment Variables

See `.env.example` for all required variables.

## 📝 API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation.

## 🚧 AWS Deployment

⚠️ **Important**: Before deploying to AWS, ensure you have:
- RDS PostgreSQL instance with pgvector extension
- S3 buckets for file storage
- EC2 instance configured
- All credentials in `.env`

See the main prompt for detailed AWS Free Tier deployment instructions.

## 📄 License

Built for Nepal. Ready for the World.
