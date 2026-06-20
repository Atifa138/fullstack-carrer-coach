"""FastAPI application entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import Base, engine
from .routers import auth, profile, chat, resume, roadmap

# Create all tables on startup (simple approach for SQLite; use Alembic for prod migrations)
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.app_name, version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(chat.router)
app.include_router(resume.router)
app.include_router(roadmap.router)


@app.get("/api/health", tags=["health"])
def health():
    return {"status": "ok", "app": settings.app_name, "ai_provider": settings.ai_provider}
