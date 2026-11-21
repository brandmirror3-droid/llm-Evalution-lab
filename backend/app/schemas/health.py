"""Schemas for health checks, readiness probes, and lab subsystem statuses."""

from datetime import datetime
from typing import Dict, List, Literal, Optional, Any
from pydantic import BaseModel, Field

SubsystemState = Literal[
    "operational",
    "degraded",
    "disconnected",
    "not_configured",
    "not_implemented",
    "awaiting_setup",
]


class SubsystemHealth(BaseModel):
    """Detailed health report for a distinct subsystem."""

    name: str
    status: SubsystemState
    message: str
    target: Optional[str] = None
    latency_ms: Optional[float] = None
    details: Optional[Dict[str, Any]] = None


class HealthCheckResponse(BaseModel):
    """Liveness probe response."""

    status: Literal["healthy", "degraded", "unhealthy"]
    timestamp: datetime
    version: str
    phase: str
    environment: str


class ReadinessResponse(BaseModel):
    """Readiness probe response verifying downstream subsystem availability."""

    ready: bool
    status: Literal["ready", "not_ready", "partially_ready"]
    timestamp: datetime
    subsystems: Dict[str, SubsystemHealth]


class ProviderConfigStatus(BaseModel):
    """Model provider credential configuration telemetry without secrets."""

    provider: str
    label: str
    configured: bool
    phase_target: str = "Phase 2"


class ReadinessItem(BaseModel):
    """Single item in the foundational platform readiness checklist."""

    category: str
    title: str
    status: Literal["verified", "in_progress", "pending", "awaiting_setup"]
    details: str
    implemented_in_phase: int = 1


class LabStatusOverview(BaseModel):
    """Comprehensive status for Phase 1 Overview research dashboard."""

    environment: str
    debug: bool
    version: str
    phase: str
    subsystems: Dict[str, SubsystemHealth]
    providers: List[ProviderConfigStatus]
    readiness_checklist: List[ReadinessItem]
