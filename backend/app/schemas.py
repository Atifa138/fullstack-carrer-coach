"""Pydantic schemas (request bodies & response models)."""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict


# ---------- Auth ----------
class UserCreate(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=1, max_length=120)
    password: str = Field(min_length=6, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: EmailStr
    full_name: str
    is_verified: bool
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ---------- Profile ----------
class ProfileUpdate(BaseModel):
    current_role: str = ""
    target_role: str = ""
    years_experience: float = 0
    skills: str = ""
    industry: str = ""
    bio: str = ""


class ProfileOut(ProfileUpdate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    updated_at: datetime


# ---------- Chat ----------
class ChatRequest(BaseModel):
    conversation_id: Optional[int] = None
    message: str = Field(min_length=1)


class MessageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    role: str
    content: str
    created_at: datetime


class ConversationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    created_at: datetime


class ConversationDetail(ConversationOut):
    messages: list[MessageOut] = []


class ChatResponse(BaseModel):
    conversation_id: int
    reply: MessageOut


# ---------- Resume ----------
class ResumeRequest(BaseModel):
    resume_text: str = Field(min_length=20)
    target_role: str = ""


class ResumeAnalysisOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    target_role: str
    feedback: str
    score: int
    created_at: datetime


# ---------- Roadmap ----------
class RoadmapRequest(BaseModel):
    goal: str = Field(min_length=3)


class RoadmapOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    goal: str
    content: str
    created_at: datetime
