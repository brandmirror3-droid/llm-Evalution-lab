"""Tests for centralized error handling and future module action rejection."""

import pytest


@pytest.mark.asyncio
async def test_404_not_found(async_client):
    """Verify non-existent API routes return standardized error envelope."""
    response = await async_client.get("/api/v1/non_existent_route")
    assert response.status_code == 404
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "HTTP_404"


@pytest.mark.asyncio
async def test_roadmap_module_listing(async_client):
    """Verify listing roadmap modules returns all future targets."""
    response = await async_client.get("/api/v1/modules")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    modules = data["data"]
    slugs = [m["module_name"] for m in modules]
    assert "Playground" in slugs
    assert "Benchmarks" in slugs
    assert "Failure Analysis" in slugs


@pytest.mark.asyncio
async def test_reject_unreleased_phase_action(async_client):
    """Verify attempting an action on a future module raises HTTP 501 Not Implemented."""
    response = await async_client.post("/api/v1/modules/playground/execute")
    assert response.status_code == 501
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "PHASE_NOT_IMPLEMENTED"
    assert data["error"]["details"]["planned_phase"] == 2
    assert "Phase 1" in data["error"]["message"]
