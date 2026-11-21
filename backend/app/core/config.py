"""Core application configuration using Pydantic Settings.

Ensures strict validation of environment variables, prevents accidental leakage of
secrets, and provides runtime diagnostics for platform readiness and health.
"""

from typing import List, Literal, Optional
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables and .env file."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )

    # Core Environment
    ENVIRONMENT: Literal["development", "staging", "production", "testing"] = Field(
        default="development",
        description="Current runtime environment",
    )
    DEBUG: bool = Field(default=True, description="Enable debug mode")
    LOG_LEVEL: str = Field(default="INFO", description="Structured logging level")

    # Server Configuration
    BACKEND_HOST: str = Field(default="127.0.0.1", description="Host to bind server")
    BACKEND_PORT: int = Field(default=8000, description="Port to bind server")
    API_V1_PREFIX: str = Field(default="/api/v1", description="Version 1 API prefix")
    PROJECT_NAME: str = "LLM Evaluation Lab"
    VERSION: str = "0.1.0"
    PHASE: str = "Phase 1: Lab Foundation & Architecture"

    # Security
    SECRET_KEY: str = Field(
        default="lab_foundation_secret_key_minimum_32_characters_for_dev_mode",
        description="Application secret key used for session/token verification",
    )
    CORS_ORIGINS: List[str] = Field(
        default_factory=lambda: [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ],
        description="Allowed CORS origin domains",
    )

    # Database
    DATABASE_URL: Optional[str] = Field(
        default=None,
        description="Async SQLAlchemy database connection string",
    )
    DB_ECHO: bool = Field(default=False, description="Log raw SQL statements")
    DB_POOL_SIZE: int = Field(default=5, description="Connection pool size")
    DB_MAX_OVERFLOW: int = Field(default=10, description="Max overflow pool connections")

    # Model Providers (Phase 2 readiness - strictly checked without external calls)
    OPENAI_API_KEY: Optional[str] = Field(default=None, description="OpenAI API Key")
    ANTHROPIC_API_KEY: Optional[str] = Field(default=None, description="Anthropic API Key")
    GEMINI_API_KEY: Optional[str] = Field(default=None, description="Gemini API Key")

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v):
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                import json
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        return ["http://localhost:5173", "http://127.0.0.1:5173"]

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"

    @property
    def is_testing(self) -> bool:
        return self.ENVIRONMENT == "testing"

    def get_masked_db_url(self) -> Optional[str]:
        """Return safe database URL with credentials redacted for telemetry."""
        if not self.DATABASE_URL:
            return None
        try:
            # Mask user:password if present
            if "@" in self.DATABASE_URL:
                scheme_user, host_path = self.DATABASE_URL.split("@", 1)
                scheme = scheme_user.split("://")[0]
                return f"{scheme}://***:***@{host_path}"
            return self.DATABASE_URL
        except Exception:
            return "configured_url_redacted"

    def get_provider_status(self) -> dict[str, dict[str, str | bool]]:
        """Return status of model providers without revealing secrets."""
        return {
            "openai": {
                "configured": bool(self.OPENAI_API_KEY and len(self.OPENAI_API_KEY.strip()) > 0),
                "phase_status": "Phase 2 Target",
                "label": "OpenAI",
            },
            "anthropic": {
                "configured": bool(self.ANTHROPIC_API_KEY and len(self.ANTHROPIC_API_KEY.strip()) > 0),
                "phase_status": "Phase 2 Target",
                "label": "Anthropic",
            },
            "gemini": {
                "configured": bool(self.GEMINI_API_KEY and len(self.GEMINI_API_KEY.strip()) > 0),
                "phase_status": "Phase 2 Target",
                "label": "Google Gemini",
            },
        }


# Global settings singleton
settings = Settings()
