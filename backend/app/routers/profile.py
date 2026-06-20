"""Profile routes: read and update the current user's profile."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user
from ..models import User, Profile
from ..schemas import ProfileOut, ProfileUpdate

router = APIRouter(prefix="/api/profile", tags=["profile"])


def _get_or_create(db: Session, user: User) -> Profile:
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if profile is None:
        profile = Profile(user_id=user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile


@router.get("", response_model=ProfileOut)
def get_profile(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return _get_or_create(db, user)


@router.put("", response_model=ProfileOut)
def update_profile(
    payload: ProfileUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    profile = _get_or_create(db, user)
    for field, value in payload.model_dump().items():
        setattr(profile, field, value)
    db.commit()
    db.refresh(profile)
    return profile
