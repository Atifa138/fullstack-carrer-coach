# CareerCoach AI

A full-stack AI career coaching app. Chat with an AI coach, get scored resume
feedback, and generate step-by-step career roadmaps — with real user accounts and
persistent data.

- **Backend:** Python · FastAPI · SQLAlchemy · SQLite · JWT auth
- **Frontend:** React (Vite) · React Router · Tailwind CSS
- **AI:** pluggable free providers (Groq or Google Gemini) with an offline fallback
  so the app works even before you add an API key.

## Features

| Feature | What it does |
|--------|--------------|
| Authentication | Register / login with hashed passwords and JWT tokens |
| Profile | Store role, target role, experience, skills — used as AI context |
| AI Coach | Persistent multi-conversation chat with a career coach |
| Resume review | Paste a resume + target role, get a 0–100 score and fixes |
| Roadmap | Turn a goal into a phased plan with skills, projects, milestones |
| Persistence | Everything is saved per user in a SQLite database |

## Quick start (TL;DR)

```bash
# 1. Backend
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload          # http://localhost:8000

# 2. Frontend (new terminal)
cd frontend
npm install
npm run dev                            # http://localhost:5173
```

Open http://localhost:5173 and create an account. The app runs immediately in
**offline AI mode**. To enable real AI, add a free key — see `SETUP_GUIDE.md`.

## Full instructions

See **`SETUP_GUIDE.md`** for the complete step-by-step walkthrough, free AI key
setup, troubleshooting, and deployment notes.

## Project layout

```
career-coach-ai/
├── backend/                 FastAPI app
│   ├── app/
│   │   ├── main.py          app entry + CORS + routers
│   │   ├── config.py        settings (.env)
│   │   ├── database.py      SQLAlchemy engine/session
│   │   ├── models.py        ORM tables
│   │   ├── schemas.py       Pydantic models
│   │   ├── security.py      password hashing + JWT
│   │   ├── deps.py          current-user dependency
│   │   ├── ai/              AI provider + prompts
│   │   └── routers/         auth, profile, chat, resume, roadmap
│   ├── requirements.txt
│   └── .env.example
└── frontend/                React + Vite app
    └── src/
        ├── api/client.js    fetch wrapper
        ├── context/         auth state
        ├── components/      navbar, markdown, route guard
        └── pages/           landing, auth, dashboard, coach, resume, roadmap, profile
```

## API overview

Interactive docs are auto-generated at **http://localhost:8000/docs** while the
backend runs.

```
POST /api/auth/register        create account -> { access_token, user }
POST /api/auth/login           login         -> { access_token, user }
GET  /api/auth/me              current user
GET/PUT /api/profile           read / update profile
GET  /api/chat/conversations   list conversations
POST /api/chat                 send a message -> AI reply
POST /api/resume/analyze       analyse resume -> feedback + score
POST /api/roadmap/generate     generate a roadmap
```
