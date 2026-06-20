"""Authentication routes: register, login, verify email, and /me."""
import secrets

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ..config import settings
from ..database import get_db
from ..deps import get_current_user
from ..email_service import send_verification_email
from ..models import User, Profile
from ..schemas import UserCreate, Token, UserOut
from ..security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(
    payload: UserCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # When email is disabled (default / offline mode) auto-verify so UX is unchanged.
    auto_verified = not settings.email_enabled
    verification_token = None if auto_verified else secrets.token_urlsafe(32)

    user = User(
        email=payload.email,
        full_name=payload.full_name,
        hashed_password=hash_password(payload.password),
        is_verified=auto_verified,
        verification_token=verification_token,
    )
    db.add(user)
    db.flush()
    db.add(Profile(user_id=user.id))
    db.commit()
    db.refresh(user)

    if not auto_verified:
        background_tasks.add_task(send_verification_email, user.email, verification_token)

    token = create_access_token(str(user.id))
    return Token(access_token=token, user=UserOut.model_validate(user))


@router.post("/login", response_model=Token)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form.username).first()
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email before logging in. Check your inbox.",
        )
    token = create_access_token(str(user.id))
    return Token(access_token=token, user=UserOut.model_validate(user))


@router.get("/verify")
def verify_email(token: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.verification_token == token).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired verification token.")
    user.is_verified = True
    user.verification_token = None
    db.commit()
    return {"message": "Email verified. You can now sign in."}


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user
