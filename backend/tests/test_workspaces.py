"""Tests for foundational Workspace entity and CRUD operations."""

import pytest


@pytest.mark.asyncio
async def test_workspace_crud_flow(client_with_db):
    """Verify creating, listing, and retrieving workspaces with isolated database."""
    # 1. List initially empty
    response = await client_with_db.get("/api/v1/workspaces")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]) == 0

    # 2. Create workspace
    payload = {
        "name": "Safety & Alignment Lab",
        "slug": "safety-alignment",
        "description": "Primary workspace for safety and alignment benchmarks.",
    }
    create_res = await client_with_db.post("/api/v1/workspaces", json=payload)
    assert create_res.status_code == 201
    created_workspace = create_res.json()["data"]
    workspace_id = created_workspace["id"]
    assert created_workspace["name"] == payload["name"]
    assert created_workspace["slug"] == payload["slug"]

    # 3. List contains created workspace
    list_res = await client_with_db.get("/api/v1/workspaces")
    assert list_res.status_code == 200
    assert len(list_res.json()["data"]) == 1

    # 4. Get workspace by ID
    get_res = await client_with_db.get(f"/api/v1/workspaces/{workspace_id}")
    assert get_res.status_code == 200
    assert get_res.json()["data"]["id"] == workspace_id

    # 5. Non-existent ID returns 404
    missing_res = await client_with_db.get("/api/v1/workspaces/non_existent_uuid_12345")
    assert missing_res.status_code == 404
    assert missing_res.json()["error"]["code"] == "ENTITY_NOT_FOUND"

    # 6. Duplicate slug returns 409 Conflict
    dup_res = await client_with_db.post("/api/v1/workspaces", json=payload)
    assert dup_res.status_code == 409
    assert dup_res.json()["error"]["code"] == "WORKSPACE_SLUG_CONFLICT"
