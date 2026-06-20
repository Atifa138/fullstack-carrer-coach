"""AI provider abstraction.

Supports three modes via settings.ai_provider:
  - "groq"    : Groq cloud (free tier, OpenAI-compatible chat completions)
  - "gemini"  : Google Gemini (free tier)
  - "offline" : deterministic local fallback so the app works with no API key

All public functions accept a list of {"role","content"} messages plus a system
prompt and return a plain string.
"""
from __future__ import annotations

import httpx

from ..config import settings

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"


async def _call_groq(system: str, messages: list[dict]) -> str:
    headers = {"Authorization": f"Bearer {settings.groq_api_key}"}
    payload = {
        "model": settings.groq_model,
        "messages": [{"role": "system", "content": system}, *messages],
        "temperature": 0.7,
    }
    async with httpx.AsyncClient(timeout=60) as client:
        r = await client.post(GROQ_URL, json=payload, headers=headers)
        r.raise_for_status()
        data = r.json()
        return data["choices"][0]["message"]["content"].strip()


async def _call_gemini(system: str, messages: list[dict]) -> str:
    # Gemini uses "contents" with roles user/model; map assistant -> model.
    contents = []
    for m in messages:
        role = "model" if m["role"] == "assistant" else "user"
        contents.append({"role": role, "parts": [{"text": m["content"]}]})
    payload = {
        "system_instruction": {"parts": [{"text": system}]},
        "contents": contents,
    }
    url = GEMINI_URL.format(model=settings.gemini_model)
    async with httpx.AsyncClient(timeout=60) as client:
        r = await client.post(url, json=payload, params={"key": settings.gemini_api_key})
        r.raise_for_status()
        data = r.json()
        return data["candidates"][0]["content"]["parts"][0]["text"].strip()


def _offline_reply(system: str, messages: list[dict]) -> str:
    """Heuristic, no-network fallback. Keeps the product usable without keys."""
    last_user = next((m["content"] for m in reversed(messages) if m["role"] == "user"), "")
    text = last_user.lower()

    if "RESUME REVIEWER" in system.upper() or "resume" in system.lower():
        return (
            "Overall impression\n"
            "Your resume has a solid foundation. (Offline review mode — connect a free "
            "Groq or Gemini key in backend/.env for full AI analysis.)\n\n"
            "Strengths\n- Clear structure and readable formatting.\n- Relevant experience is present.\n\n"
            "Weaknesses\n- Bullet points could be more quantified (numbers, %, impact).\n"
            "- Summary could better target the role.\n\n"
            "Specific improvements\n- Start bullets with strong action verbs.\n"
            "- Add measurable results (e.g. 'cut load time by 40%').\n"
            "- Tailor keywords to the job description.\n\n"
            "Missing keywords for the target role\n- Add role-specific tools and certifications.\n\n"
            "SCORE: 72/100"
        )
    if "ROADMAP" in system.upper():
        goal = last_user or "your goal"
        return (
            f"# Roadmap: {goal}\n\n"
            "_(Offline mode — add a free AI key in backend/.env for a fully personalised plan.)_\n\n"
            "## Phase 1 — Foundations (Weeks 1-4)\n"
            "- Learn the core fundamentals.\n- Build one small practice project.\n\n"
            "## Phase 2 — Building (Weeks 5-10)\n"
            "- Go deeper into key skills.\n- Ship a portfolio-grade project.\n\n"
            "## Phase 3 — Job ready (Weeks 11-16)\n"
            "- Polish resume & LinkedIn.\n- Practice interviews and apply.\n\n"
            "**Free resources:** freeCodeCamp, YouTube, official docs, Coursera audit mode."
        )

    # Generic coach reply
    if any(k in text for k in ("interview", "interviews")):
        tip = ("For interviews: research the company, prepare STAR stories for behavioural "
               "questions, practise out loud, and prepare 2-3 thoughtful questions to ask.")
    elif "salary" in text or "negotiat" in text:
        tip = ("For salary negotiation: know your market rate, let them name a number first, "
               "anchor slightly high, and negotiate the whole package, not just base pay.")
    elif "resume" in text or "cv" in text:
        tip = ("For your resume: quantify achievements, lead with impact, keep it to 1-2 pages, "
               "and tailor keywords to each job.")
    else:
        tip = ("Break your goal into small weekly steps, track progress, and focus on building "
               "visible proof of skill (projects, contributions, results).")
    return (
        f"{tip}\n\n(Offline coach mode — add a free Groq or Gemini API key in backend/.env "
        "to unlock the full AI coach.)"
    )


async def generate(system: str, messages: list[dict]) -> str:
    """Route to the configured provider, falling back to offline on any error."""
    provider = settings.ai_provider.lower()
    try:
        if provider == "groq" and settings.groq_api_key:
            return await _call_groq(system, messages)
        if provider == "gemini" and settings.gemini_api_key:
            return await _call_gemini(system, messages)
    except Exception as exc:  # network / quota / auth issues -> graceful fallback
        return _offline_reply(system, messages) + f"\n\n[note: AI provider error: {exc}]"
    return _offline_reply(system, messages)
