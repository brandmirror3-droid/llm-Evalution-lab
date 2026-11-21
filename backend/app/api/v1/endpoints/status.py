"""Lab status and readiness overview endpoints."""

import sys
from fastapi import APIRouter
from app.core.config import settings
from app.db.session import check_db_health
from app.schemas.common import ResponseEnvelope
from app.schemas.health import (
    LabStatusOverview,
    ProviderConfigStatus,
    ReadinessItem,
    SubsystemHealth,
)

router = APIRouter()


@router.get(
    "/status",
    response_model=ResponseEnvelope[LabStatusOverview],
    summary="Comprehensive lab status and subsystem readiness audit",
    description="Provides honest diagnostics of environment, database, provider credentials, and roadmap readiness.",
)
async def get_lab_status() -> ResponseEnvelope[LabStatusOverview]:
    db_result = await check_db_health(timeout_seconds=2.0)

    # 1. Probe subsystems honestly
    subsystems = {
        "environment": SubsystemHealth(
            name="Runtime Environment",
            status="operational",
            message=f"Python {sys.version.split()[0]} running in {settings.ENVIRONMENT} mode.",
            details={"debug": settings.DEBUG, "version": settings.VERSION},
        ),
        "api": SubsystemHealth(
            name="API Foundation",
            status="operational",
            message="FastAPI core router, validation, and error envelopes active.",
        ),
        "database": SubsystemHealth(
            name="PostgreSQL Database",
            status=db_result["status"],
            message=db_result["message"],
            target=db_result.get("target"),
            latency_ms=db_result.get("latency_ms"),
        ),
        "experiment_infrastructure": SubsystemHealth(
            name="Experiment Infrastructure",
            status="not_implemented",
            message="Execution queue and runner infrastructure scheduled for Phase 2/3.",
        ),
    }

    # 2. Check model provider configuration telemetry (no secret leakage)
    providers_raw = settings.get_provider_status()
    providers: list[ProviderConfigStatus] = [
        ProviderConfigStatus(
            provider=k,
            label=v["label"],
            configured=bool(v["configured"]),
            phase_target=str(v["phase_status"]),
        )
        for k, v in providers_raw.items()
    ]

    # 3. Compile platform readiness checklist (honestly reflecting verified vs pending)
    is_db_verified = db_result["connected"]
    readiness_checklist: list[ReadinessItem] = [
        ReadinessItem(
            category="Core Architecture",
            title="Application Foundation & Shell",
            status="verified",
            details="Modular FastAPI backend and React TypeScript laboratory shell.",
            implemented_in_phase=1,
        ),
        ReadinessItem(
            category="API & Telemetry",
            title="Versioned API & Health Probes",
            status="verified",
            details="Structured logging, CORS, security headers, and live probes active on /api/v1.",
            implemented_in_phase=1,
        ),
        ReadinessItem(
            category="Storage",
            title="Database Connection",
            status="verified" if is_db_verified else "awaiting_setup",
            details=(
                "PostgreSQL connected and responsive."
                if is_db_verified
                else "PostgreSQL connection string pending or server unreachable."
            ),
            implemented_in_phase=1,
        ),
        ReadinessItem(
            category="Security",
            title="Authentication Infrastructure",
            status="awaiting_setup",
            details="Token authentication and role-based access control scheduled for future enterprise phase.",
            implemented_in_phase=1,
        ),
        ReadinessItem(
            category="Model Integration",
            title="Model Provider Execution Engine",
            status="pending",
            details="Multi-provider runtime and playground interface scheduled for Phase 2.",
            implemented_in_phase=2,
        ),
        ReadinessItem(
            category="Evaluation",
            title="Benchmark & Dataset Engine",
            status="pending",
            details="Standardized benchmarking suites and dataset loaders scheduled for Phase 3.",
            implemented_in_phase=3,
        ),
    ]

    overview = LabStatusOverview(
        environment=settings.ENVIRONMENT,
        debug=settings.DEBUG,
        version=settings.VERSION,
        phase=settings.PHASE,
        subsystems=subsystems,
        providers=providers,
        readiness_checklist=readiness_checklist,
    )

    return ResponseEnvelope(data=overview)
