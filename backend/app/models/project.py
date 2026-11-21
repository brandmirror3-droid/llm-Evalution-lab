"""Project entity representing an evaluation initiative or model research campaign."""

from typing import TYPE_CHECKING
from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.workspace import Workspace


class Project(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """A research project grouping evaluations, datasets, and benchmark runs."""

    __tablename__ = "projects"

    workspace_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("workspaces.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    slug: Mapped[str] = mapped_column(String(140), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)

    workspace: Mapped["Workspace"] = relationship(
        "Workspace",
        back_populates="projects",
    )
