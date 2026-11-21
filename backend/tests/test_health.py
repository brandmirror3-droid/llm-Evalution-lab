"""Tests for health, readiness, and status telemetry endpoints."""

import pytest


@pytest.mark.asyncio
async def test_root_endpoint(async_client):
    """Verify service root returns lab metadata and versioning."""
    response = await async_client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "LLM Evaluation Lab"
    assert "version" in data
    assert "health_check" in data
    assert "status_audit" in data


@pytest.mark.asyncio
async def test_health_liveness_probe(async_client):
    """Verify /api/v1/health returns healthy status."""
    response = await async_client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data
    assert "timestamp" in data
    assert "phase" in data


@pytest.mark.asyncio
async def test_readiness_probe(async_client):
    """Verify /api/v1/readiness inspects subsystems without crashing."""
    response = await async_client.get("/api/v1/readiness")
    # In test environment, if Postgres is not configured/running, returns degraded or not_ready status
    assert response.status_code in [200, 503]
    data = response.json()
    assert "ready" in data
    assert "status" in data
    assert "subsystems" in data
    assert "database" in data["subsystems"]
    assert "api" in data["subsystems"]


@pytest.mark.asyncio
async def test_status_overview(async_client):
    """Verify /api/v1/status delivers honest lab telemetry."""
    response = await async_client.get("/api/v1/status")
    assert response.status_code == 200
    envelope = response.json()
    assert envelope["success"] is True
    data = envelope["data"]

    # Environment
    assert "environment" in data
    assert "version" in data
    assert "phase" in data

    # Subsystems
    subsystems = data["subsystems"]
    assert "environment" in subsystems
    assert "database" in subsystems
    assert "experiment_infrastructure" in subsystems
    # Experiment infrastructure must honestly state not_implemented in Phase 1
    assert subsystems["experiment_infrastructure"]["status"] == "not_implemented"

    # Model providers telemetry
    providers = data["providers"]
    assert len(providers) >= 3
    provider_names = [p["provider"] for p in providers]
    assert "openai" in provider_names
    assert "anthropic" in provider_names
    assert "gemini" in provider_names

    # Readiness checklist
    checklist = data["readiness_checklist"]
    assert len(checklist) >= 5
    categories = [item["category"] for item in checklist]
    assert "Core Architecture" in categories
    assert "Storage" in categories
