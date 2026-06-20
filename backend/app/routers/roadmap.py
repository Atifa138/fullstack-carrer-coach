"""Roadmap routes: generate and list career roadmaps."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..ai import provider, prompts
from ..database import get_db
from ..deps import get_current_user
from ..models import User, Roadmap
from ..schemas import RoadmapRequest, RoadmapOut

router = APIRouter(prefix="/api/roadmap", tags=["roadmap"])


@router.post("/generate", response_model=RoadmapOut)
async def generate_roadmap(
    payload: RoadmapRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    profile_ctx = prompts.build_profile_context(user.profile)
    user_content = payload.goal + (f"\n\n{profile_ctx}" if profile_ctx else "")
    content = await provider.generate(prompts.ROADMAP_SYSTEM, [{"role": "user", "content": user_content}])

    record = Roadmap(user_id=user.id, goal=payload.goal, content=content)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/history", response_model=list[RoadmapOut])
def history(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return (
        db.query(Roadmap)
        .filter(Roadmap.user_id == user.id)
        .order_by(Roadmap.created_at.desc())
        .all()
    )
