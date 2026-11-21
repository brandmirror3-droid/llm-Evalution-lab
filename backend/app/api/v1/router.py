"""Main API v1 router consolidating all foundational endpoint groups."""

from fastapi import APIRouter
from app.api.v1.endpoints import health, status, workspaces, placeholders

api_v1_router = APIRouter()

# Health and readiness probes
api_v1_router.include_router(health.router, tags=["Infrastructure & Probes"])

# Lab status and system audit
api_v1_router.include_router(status.router, tags=["Lab Telemetry & Readiness"])

# Workspaces foundation
api_v1_router.include_router(workspaces.router, prefix="/workspaces", tags=["Workspaces"])

# Roadmap modules registry
api_v1_router.include_router(placeholders.router, prefix="/modules", tags=["Roadmap Modules"])
