"""Application configuration loaded from environment variables / .env file."""
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # --- Core ---
    app_name: str = "CareerCoach AI"
    secret_key: str = "CHANGE_ME_super_secret_key_for_jwt_signing"
    access_token_expire_minutes: int = 60 * 24 * 7  # 7 days
    algorithm: str = "HS256"

    # --- Database ---
    database_url: str = "sqlite:///./careercoach.db"

    # --- CORS (comma separated origins) ---
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    # --- Email verification ---
    # Set EMAIL_ENABLED=true and fill SMTP_* vars to send real emails.
    # When false (default), new users are auto-verified so dev flow is unchanged.
    email_enabled: bool = False
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_username: str = ""
    smtp_password: str = ""
    smtp_from: str = "noreply@careercoach.ai"
    app_base_url: str = "http://localhost:5173"

    # --- AI provider: groq | gemini | offline ---
    ai_provider: str = "offline"
    groq_api_key: str = ""
    groq_model: str = "llama-3.3-70b-versatile"
    gemini_api_key: str = ""
    gemini_model: str = "gemini-1.5-flash"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
