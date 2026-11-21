"""Pytest fixtures for backend test suite."""

import os
import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

# Force testing environment before importing app
os.environ["ENVIRONMENT"] = "testing"
os.environ["DEBUG"] = "true"

from app.core.config import settings
from app.db.base import Base
from app.db.session import get_db_session
from app.main import create_app

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"


@pytest.fixture(scope="session")
def test_app():
    return create_app()


@pytest.fixture
async def async_client(test_app):
    transport = ASGITransport(app=test_app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        yield client


@pytest.fixture
async def test_db_session():
    """In-memory SQLite async engine and session for database tests."""
    engine = create_async_engine(TEST_DATABASE_URL, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    session_factory = async_sessionmaker(bind=engine, expire_on_commit=False)
    async with session_factory() as session:
        yield session

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()


@pytest.fixture
async def client_with_db(test_app, test_db_session):
    """Test client with overridden database dependency providing in-memory SQLite session."""
    async def _override_get_db_session():
        yield test_db_session

    test_app.dependency_overrides[get_db_session] = _override_get_db_session
    transport = ASGITransport(app=test_app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        yield client

    test_app.dependency_overrides.clear()
