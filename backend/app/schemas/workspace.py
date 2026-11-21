"""Pydantic schemas for Workspace management."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class WorkspaceBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=120, description="Workspace name")
    description: Optional[str] = Field(None, max_length=1000, description="Workspace description")


class WorkspaceCreate(WorkspaceBase):
    slug: Optional[str] = Field(None, min_length=2, max_length=140, description="URL-friendly slug (auto-generated if omitted)")


class WorkspaceUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=120)
    description: Optional[str] = Field(None, max_length=1000)
    is_default: Optional[bool] = None


class WorkspaceResponse(WorkspaceBase):
    id: str
    slug: str
    is_default: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
