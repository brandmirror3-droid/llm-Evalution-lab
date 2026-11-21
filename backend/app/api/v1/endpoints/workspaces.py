"""Workspace management endpoints for foundational organization."""

import re
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.errors import EntityNotFoundException, LabException
from app.db.session import get_db_session
from app.models.workspace import Workspace
from app.schemas.common import ResponseEnvelope
from app.schemas.workspace import WorkspaceCreate, WorkspaceResponse, WorkspaceUpdate

router = APIRouter()


def slugify(text: str) -> str:
    """Generate a clean URL slug from input string."""
    slug = text.lower().strip()
    slug = re.sub(r"[^\w\s-]", "", slug)
    slug = re.sub(r"[\s_-]+", "-", slug)
    return slug.strip("-")


@router.get(
    "",
    response_model=ResponseEnvelope[List[WorkspaceResponse]],
    summary="List all research workspaces",
)
async def list_workspaces(
    db: AsyncSession = Depends(get_db_session),
) -> ResponseEnvelope[List[WorkspaceResponse]]:
    stmt = select(Workspace).order_by(Workspace.created_at.asc())
    result = await db.execute(stmt)
    workspaces = result.scalars().all()
    return ResponseEnvelope(data=[WorkspaceResponse.model_validate(w) for w in workspaces])


@router.post(
    "",
    response_model=ResponseEnvelope[WorkspaceResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Create a new research workspace",
)
async def create_workspace(
    payload: WorkspaceCreate,
    db: AsyncSession = Depends(get_db_session),
) -> ResponseEnvelope[WorkspaceResponse]:
    slug = payload.slug or slugify(payload.name)

    # Check for slug uniqueness
    stmt = select(Workspace).where(Workspace.slug == slug)
    existing = (await db.execute(stmt)).scalar_one_or_none()
    if existing:
        raise LabException(
            message=f"Workspace with slug '{slug}' already exists.",
            status_code=status.HTTP_409_CONFLICT,
            code="WORKSPACE_SLUG_CONFLICT",
            details={"slug": slug},
        )

    workspace = Workspace(
        name=payload.name,
        slug=slug,
        description=payload.description,
        is_default=False,
    )
    db.add(workspace)
    await db.commit()
    await db.refresh(workspace)

    return ResponseEnvelope(data=WorkspaceResponse.model_validate(workspace))


@router.get(
    "/{workspace_id}",
    response_model=ResponseEnvelope[WorkspaceResponse],
    summary="Get workspace details by ID",
)
async def get_workspace(
    workspace_id: str,
    db: AsyncSession = Depends(get_db_session),
) -> ResponseEnvelope[WorkspaceResponse]:
    stmt = select(Workspace).where(Workspace.id == workspace_id)
    workspace = (await db.execute(stmt)).scalar_one_or_none()
    if not workspace:
        raise EntityNotFoundException("Workspace", workspace_id)

    return ResponseEnvelope(data=WorkspaceResponse.model_validate(workspace))
