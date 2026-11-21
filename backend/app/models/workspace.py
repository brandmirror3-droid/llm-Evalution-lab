"""Workspace entity representing an isolated research organization or environment."""

from typing import List, TYPE_CHECKING
from sqlalchemy import Boolean, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.project import Project


class Workspace(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """A research workspace that groups related projects, benchmarks, and model evaluations."""

    __tablename__ = "workspaces"

    name: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(140), nullable=False, unique=True, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    is_default: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Future relationship: 1 workspace has many projects
    projects: Mapped[List["Project"]] = relationship(
        "Project",
        back_populates="workspace",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
