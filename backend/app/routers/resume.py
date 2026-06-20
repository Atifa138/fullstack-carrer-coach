"""Resume routes: analyse a resume and list past analyses."""
import io
import re

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from ..ai import provider, prompts
from ..database import get_db
from ..deps import get_current_user
from ..models import User, ResumeAnalysis
from ..schemas import ResumeRequest, ResumeAnalysisOut

_MAX_BYTES = 5 * 1024 * 1024  # 5 MB


def _extract_text(upload: UploadFile, raw: bytes) -> str:
    name = (upload.filename or "").lower()
    ct = (upload.content_type or "").lower()

    if name.endswith(".pdf") or "pdf" in ct:
        try:
            from pypdf import PdfReader
            reader = PdfReader(io.BytesIO(raw))
            text = "\n".join(page.extract_text() or "" for page in reader.pages)
        except Exception as exc:
            raise HTTPException(status_code=422, detail=f"Could not read PDF: {exc}")

    elif name.endswith(".docx") or "wordprocessingml" in ct or "openxmlformats" in ct:
        try:
            import docx
            doc = docx.Document(io.BytesIO(raw))
            text = "\n".join(p.text for p in doc.paragraphs)
        except Exception as exc:
            raise HTTPException(status_code=422, detail=f"Could not read DOCX: {exc}")

    else:
        # Plain text / fallback
        try:
            text = raw.decode("utf-8")
        except UnicodeDecodeError:
            text = raw.decode("latin-1")

    text = text.strip()
    if len(text) < 20:
        raise HTTPException(status_code=422, detail="Could not extract enough text from the file.")
    return text

router = APIRouter(prefix="/api/resume", tags=["resume"])


def _extract_score(feedback: str) -> int:
    match = re.search(r"SCORE:\s*(\d{1,3})", feedback, re.IGNORECASE)
    if match:
        return max(0, min(100, int(match.group(1))))
    return 0


@router.post("/analyze", response_model=ResumeAnalysisOut)
async def analyze(
    payload: ResumeRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    user_content = (
        f"Target role: {payload.target_role or 'general'}\n\n"
        f"Resume:\n{payload.resume_text}"
    )
    feedback = await provider.generate(prompts.RESUME_SYSTEM, [{"role": "user", "content": user_content}])
    score = _extract_score(feedback)

    record = ResumeAnalysis(
        user_id=user.id,
        resume_text=payload.resume_text,
        target_role=payload.target_role,
        feedback=feedback,
        score=score,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.post("/upload", response_model=ResumeAnalysisOut)
async def upload_resume(
    file: UploadFile = File(...),
    target_role: str = Form(""),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    raw = await file.read()
    if len(raw) > _MAX_BYTES:
        raise HTTPException(status_code=413, detail="File too large (max 5 MB).")

    resume_text = _extract_text(file, raw)

    user_content = (
        f"Target role: {target_role or 'general'}\n\n"
        f"Resume:\n{resume_text}"
    )
    feedback = await provider.generate(prompts.RESUME_SYSTEM, [{"role": "user", "content": user_content}])
    score = _extract_score(feedback)

    record = ResumeAnalysis(
        user_id=user.id,
        resume_text=resume_text,
        target_role=target_role,
        feedback=feedback,
        score=score,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/history", response_model=list[ResumeAnalysisOut])
def history(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return (
        db.query(ResumeAnalysis)
        .filter(ResumeAnalysis.user_id == user.id)
        .order_by(ResumeAnalysis.created_at.desc())
        .all()
    )
