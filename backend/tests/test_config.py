"""Tests for environment configuration and security validation."""

from app.core.config import Settings


def test_settings_default_values():
    """Verify safe default configuration."""
    cfg = Settings()
    assert cfg.PROJECT_NAME == "LLM Evaluation Lab"
    assert cfg.API_V1_PREFIX == "/api/v1"
    assert len(cfg.CORS_ORIGINS) > 0
    assert "http://localhost:5173" in cfg.CORS_ORIGINS


def test_settings_masked_db_url():
    """Verify database password is not leaked in telemetry."""
    cfg = Settings(DATABASE_URL="postgresql+asyncpg://admin:super_secret_password@db.internal:5432/eval_lab")
    masked = cfg.get_masked_db_url()
    assert "super_secret_password" not in masked
    assert "***:***" in masked
    assert "db.internal:5432/eval_lab" in masked


def test_settings_provider_status_hides_secrets():
    """Verify provider status reports configuration boolean without leaking secret keys."""
    cfg = Settings(
        OPENAI_API_KEY="sk-mock-secret-key-12345",
        ANTHROPIC_API_KEY="",
        GEMINI_API_KEY=None,
    )
    status = cfg.get_provider_status()
    assert status["openai"]["configured"] is True
    assert "sk-mock" not in str(status)
    assert status["anthropic"]["configured"] is False
    assert status["gemini"]["configured"] is False
