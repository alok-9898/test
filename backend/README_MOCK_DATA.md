# Mock Data Mode - Quick Start Guide

## 🚀 Using Mock Data (No Database Required)

The system is configured to use **mock data by default**, so you can test everything without setting up a database!

### Login Credentials

Use these demo accounts to test different roles:

#### Founder Account
- **Email**: `founder@neplaunch.com`
- **Password**: `password123`

#### Talent Account
- **Email**: `talent@neplaunch.com`
- **Password**: `password123`

#### Investor Account
- **Email**: `investor@neplaunch.com`
- **Password**: `password123`

### What's Included

The mock data includes:
- ✅ Pre-filled startup profile (TechNepal Solutions)
- ✅ Pre-filled talent profile (Raj Kumar)
- ✅ Pre-filled investor profile (Dr. Sarah Johnson)
- ✅ Sample talent matches (for founders)
- ✅ Sample investor matches (for founders)
- ✅ Sample startup matches (for talent)
- ✅ Mock pitch feedback
- ✅ Mock team gap analysis

### Running Without Database

1. **Backend** (no database needed):
```bash
cd backend
pip install -r ../requirements.txt
python run.py
```

2. **Frontend**:
```bash
cd frontend
npm install
npm run dev
```

3. **Login** with any of the demo accounts above

### Switching to Real Database

When you're ready to use a real database:

1. Set up PostgreSQL with pgvector extension
2. Update `.env` file with database credentials
3. Set `USE_MOCK_DATA=False` in `backend/config.py` or via environment variable
4. Restart the backend server

### Mock Data Files

All mock data is defined in `backend/mock_data.py`. You can modify it to test different scenarios.

### Notes

- Mock mode doesn't require OpenAI API key (pitch feedback returns mock data)
- Mock mode doesn't require AWS credentials
- All API endpoints work the same way - they just return mock data instead of querying the database
- You can still test the full UI/UX flow without any external dependencies
