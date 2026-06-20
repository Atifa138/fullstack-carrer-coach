"""Chat routes: list/read/delete conversations and send messages to the AI coach."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..ai import provider, prompts
from ..database import get_db
from ..deps import get_current_user
from ..models import User, Conversation, Message
from ..schemas import (
    ChatRequest, ChatResponse, ConversationOut, ConversationDetail, MessageOut,
)

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.get("/conversations", response_model=list[ConversationOut])
def list_conversations(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return (
        db.query(Conversation)
        .filter(Conversation.user_id == user.id)
        .order_by(Conversation.created_at.desc())
        .all()
    )


@router.get("/conversations/{conversation_id}", response_model=ConversationDetail)
def get_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    convo = (
        db.query(Conversation)
        .filter(Conversation.id == conversation_id, Conversation.user_id == user.id)
        .first()
    )
    if not convo:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return convo


@router.delete("/conversations/{conversation_id}", status_code=204)
def delete_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    convo = (
        db.query(Conversation)
        .filter(Conversation.id == conversation_id, Conversation.user_id == user.id)
        .first()
    )
    if not convo:
        raise HTTPException(status_code=404, detail="Conversation not found")
    db.delete(convo)
    db.commit()


@router.post("", response_model=ChatResponse)
async def send_message(
    payload: ChatRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    # Find or create the conversation
    if payload.conversation_id:
        convo = (
            db.query(Conversation)
            .filter(Conversation.id == payload.conversation_id, Conversation.user_id == user.id)
            .first()
        )
        if not convo:
            raise HTTPException(status_code=404, detail="Conversation not found")
    else:
        title = payload.message[:40] + ("..." if len(payload.message) > 40 else "")
        convo = Conversation(user_id=user.id, title=title)
        db.add(convo)
        db.flush()

    # Persist the user's message
    user_msg = Message(conversation_id=convo.id, role="user", content=payload.message)
    db.add(user_msg)
    db.flush()

    # Build the model context (system prompt + profile + history)
    profile_ctx = prompts.build_profile_context(user.profile)
    system = prompts.COACH_SYSTEM + (f"\n\n{profile_ctx}" if profile_ctx else "")
    history = [
        {"role": m.role, "content": m.content}
        for m in sorted(convo.messages, key=lambda x: x.created_at)
    ]

    reply_text = await provider.generate(system, history)

    assistant_msg = Message(conversation_id=convo.id, role="assistant", content=reply_text)
    db.add(assistant_msg)
    db.commit()
    db.refresh(assistant_msg)

    return ChatResponse(conversation_id=convo.id, reply=MessageOut.model_validate(assistant_msg))
