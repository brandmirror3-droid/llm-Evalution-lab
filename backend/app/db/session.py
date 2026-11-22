"""Database session management and live connectivity health checks."""

import asyncio
from typing import AsyncGenerator, Dict, Any, Optional
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.core.config import settings
from app.core.errors import DatabaseUnavailableException
from app.core.logging import logger

# Global engine and session factory handles
_engine: Optional[AsyncEngine] = None
_session_factory: Optional[async_sessionmaker[AsyncSession]] = None


def get_engine() -> Optional[AsyncEngine]:
    """Initialize or retrieve the singleton async SQLAlchemy engine."""
    global _engine, _session_factory

    if not settings.DATABASE_URL:
        return None

    if _engine is None:
        try:
            # Normalize database URL if needed
            db_url = settings.DATABASE_URL
            if db_url.startswith("postgresql://"):
                db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)

            # SQLite async driver adaptation
            if db_url.startswith("sqlite://"):
                db_url = db_url.replace("sqlite://", "sqlite+aiosqlite://", 1)

            engine_kwargs: Dict[str, Any] = {
                "echo": settings.DB_ECHO,
                "future": True,
            }

            # Pool settings are only applicable to network databases (like PostgreSQL)
            if not db_url.startswith("sqlite"):
                engine_kwargs["pool_size"] = settings.DB_POOL_SIZE
                engine_kwargs["max_overflow"] = settings.DB_MAX_OVERFLOW
                engine_kwargs["pool_pre_ping"] = True

            _engine = create_async_engine(db_url, **engine_kwargs)
            _session_factory = async_sessionmaker(
                bind=_engine,
                expire_on_commit=False,
                autoflush=False,
                autocommit=False,
            )
            logger.info(f"Initialized database engine: {settings.get_masked_db_url()}")
        except Exception as e:
            logger.error(f"Failed to initialize database engine: {e}")
            _engine = None
            _session_factory = None

    return _engine


async def check_db_health(timeout_seconds: float = 2.0) -> Dict[str, Any]:
    """Perform an honest, live probe of the database connection without fabricating status.

    Returns:
        dict: Subsystem health details with status in ["operational", "disconnected", "not_configured"].
    """
    if not settings.DATABASE_URL:
        return {
            "status": "not_configured",
            "connected": False,
            "message": "DATABASE_URL is not set. Database is awaiting configuration.",
            "target": None,
            "latency_ms": None,
        }

    engine = get_engine()
    if engine is None:
        return {
            "status": "disconnected",
            "connected": False,
            "message": "Engine initialization failed. Check connection string syntax or driver availability.",
            "target": settings.get_masked_db_url(),
            "latency_ms": None,
        }

    import time
    start = time.perf_counter()

    try:
        async def _probe():
            async with engine.connect() as conn:
                await conn.execute(text("SELECT 1"))

        await asyncio.wait_for(_probe(), timeout=timeout_seconds)
        latency_ms = round((time.perf_counter() - start) * 1000, 2)
        return {
            "status": "operational",
            "connected": True,
            "message": "Database connection verified and active.",
            "target": settings.get_masked_db_url(),
            "latency_ms": latency_ms,
        }
    except asyncio.TimeoutError:
        return {
            "status": "disconnected",
            "connected": False,
            "message": f"Connection timed out after {timeout_seconds}s.",
            "target": settings.get_masked_db_url(),
            "latency_ms": None,
        }
    except Exception as exc:
        return {
            "status": "disconnected",
            "connected": False,
            "message": f"Connection attempt failed: {str(exc)}",
            "target": settings.get_masked_db_url(),
            "latency_ms": None,
        }


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency for yielding an async database session."""
    engine = get_engine()
    if engine is None or _session_factory is None:
        raise DatabaseUnavailableException(
            "Database is unconfigured or unavailable. Set DATABASE_URL and ensure the database server is running."
        )

    async with _session_factory() as session:
        try:
            yield session
        except (SQLAlchemyError, OSError) as exc:
            await session.rollback()
            logger.warning(f"Database operation failed: {exc}")
            raise DatabaseUnavailableException(
                f"Database operation failed: {exc.__class__.__name__}. Ensure PostgreSQL server is running."
            ) from exc
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
