# CareerCoach AI — Step-by-Step Setup Guide

This guide takes you from zero to a running, fully working application. No prior
deployment experience needed. Total time: ~10 minutes.

---

## 0. What you need installed (all free)

| Tool | Why | Get it |
|------|-----|--------|
| **Python 3.10+** | runs the backend | https://www.python.org/downloads/ |
| **Node.js 18+** | runs the frontend | https://nodejs.org/ |
| A code editor (**VS Code**) | editing | https://code.visualstudio.com/ |

Check they're installed:

```bash
python --version    # or python3 --version
node --version
```

---

## 1. Get the project

Unzip `career-coach-ai.zip`. You'll have two folders: `backend/` and `frontend/`.

---

## 2. Run the backend (Python / FastAPI)

Open a terminal in the `backend/` folder.

**Create and activate a virtual environment** (keeps dependencies isolated):

```bash
# macOS / Linux
python3 -m venv .venv
source .venv/bin/activate

# Windows (PowerShell)
python -m venv .venv
.venv\Scripts\Activate.ps1
```

**Install dependencies:**

```bash
pip install -r requirements.txt
```

**Create your environment file:**

```bash
# macOS / Linux
cp .env.example .env
# Windows
copy .env.example .env
```

**Start the server:**

```bash
uvicorn app.main:app --reload
```

You should see it running at `http://localhost:8000`.
Visit `http://localhost:8000/docs` to see the interactive API documentation.
A `careercoach.db` SQLite file is created automatically on first run.

> Leave this terminal running.

---

## 3. Run the frontend (React / Vite)

Open a **second** terminal in the `frontend/` folder.

```bash
npm install
npm run dev
```

Open the URL it prints — usually **http://localhost:5173**.

That's it. Register an account and start using the app. The frontend talks to the
backend automatically through a dev proxy (configured in `vite.config.js`).

---

## 4. Turn on real AI (optional but recommended)

Out of the box the app uses **offline mode** — it gives canned-but-useful responses
so nothing breaks. To get genuine AI answers, add ONE free key.

### Option A — Groq (recommended: fast and generous free tier)

1. Go to https://console.groq.com/keys and sign up (free).
2. Create an API key and copy it.
3. Open `backend/.env` and set:

   ```env
   AI_PROVIDER=groq
   GROQ_API_KEY=your_key_here
   ```

4. Restart the backend (`Ctrl+C`, then `uvicorn app.main:app --reload`).

### Option B — Google Gemini

1. Go to https://aistudio.google.com/app/apikey and create a free key.
2. In `backend/.env` set:

   ```env
   AI_PROVIDER=gemini
   GEMINI_API_KEY=your_key_here
   ```

3. Restart the backend.

Confirm it worked: open `http://localhost:8000/api/health` — `ai_provider`
should show `groq` or `gemini`.

---

## 5. How to use the app

1. **Register** → you're taken to the dashboard.
2. **Profile** → fill in your current role, target role, skills. The coach uses this.
3. **Coach** → ask anything; conversations are saved in the left sidebar.
4. **Resume** → paste your resume + target role → get a score and concrete fixes.
5. **Roadmap** → type a goal → get a phased plan you can revisit later.

All data is tied to your account and persists across logins.

---

## 6. Recommended free tools to level this up

| Need | Free tool | Note |
|------|-----------|------|
| AI model | **Groq**, **Google Gemini**, **Ollama** (fully local) | already wired for Groq/Gemini |
| Database (prod) | **Supabase** / **Neon** (Postgres) | set `DATABASE_URL` in `.env` |
| Backend hosting | **Render**, **Railway**, **Fly.io** | free tiers available |
| Frontend hosting | **Vercel**, **Netlify**, **Cloudflare Pages** | free static hosting |
| Auth (managed, later) | **Supabase Auth**, **Clerk** | optional upgrade |
| API testing | **Hoppscotch**, **Postman** | hit the endpoints directly |
| Source control | **GitHub** | version your code |

---

## 7. Deploying to production (overview)

**Backend (e.g. Render):**
- Push the repo to GitHub.
- New Web Service → root `backend/`.
- Build: `pip install -r requirements.txt`
- Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Set env vars: `SECRET_KEY` (long random string), `AI_PROVIDER`, your AI key,
  `DATABASE_URL` (use a managed Postgres for persistence), and `CORS_ORIGINS`
  (your frontend's URL).

**Frontend (e.g. Vercel):**
- Import the repo, root `frontend/`.
- Framework: Vite. Build: `npm run build`. Output: `dist`.
- Set env var `VITE_API_URL` to your deployed backend URL (e.g.
  `https://your-backend.onrender.com`).

> For SQLite → Postgres in production, just change `DATABASE_URL`. The code uses
> SQLAlchemy, so no query changes are needed. For schema migrations over time,
> add **Alembic**.

---

## 8. Troubleshooting

| Symptom | Fix |
|--------|-----|
| `uvicorn: command not found` | Activate the venv first (step 2). |
| Frontend can't reach API | Make sure the backend is running on port 8000. |
| CORS error in browser | Add your frontend URL to `CORS_ORIGINS` in `backend/.env`. |
| AI replies say "offline mode" | Add a key and set `AI_PROVIDER` (step 4), then restart. |
| `bcrypt` install error | Upgrade pip: `pip install --upgrade pip`, then reinstall. |
| Port already in use | Run uvicorn with `--port 8001` and update the proxy in `vite.config.js`. |
| Want a clean database | Stop the backend and delete `backend/careercoach.db`. |

---

## 9. Security notes before going live

- Change `SECRET_KEY` in `.env` to a long random string.
- Never commit your real `.env` (it's gitignored on the frontend; add a backend
  `.gitignore` too).
- Use HTTPS and a managed database in production.
- Consider rate-limiting and email verification as next steps.

You're all set — happy building!
