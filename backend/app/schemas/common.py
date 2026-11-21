"""Standard envelope and pagination schemas."""

from typing import Generic, Optional, TypeVar, List
from pydantic import BaseModel, Field

T = TypeVar("T")


class PaginationMeta(BaseModel):
    """Metadata describing paginated collection results."""

    total_count: int = Field(..., description="Total items in dataset")
    page: int = Field(..., description="Current page index (1-based)")
    page_size: int = Field(..., description="Items per page")
    total_pages: int = Field(..., description="Total available pages")


class ResponseEnvelope(BaseModel, Generic[T]):
    """Standardized API response envelope wrapping all successful payloads."""

    success: bool = True
    data: T
    meta: Optional[PaginationMeta] = None


class PlannedModuleInfo(BaseModel):
    """Structured descriptor for future roadmap modules (Phases 2-12)."""

    module_name: str
    phase_number: int
    phase_title: str
    status: str = "planned"
    description: str
    target_capabilities: List[str]
