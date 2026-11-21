"""Health and readiness endpoints for infrastructure probes."""

from datetime import datetime, timezone
from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.db.session import check_db_health
from app.schemas.health import (
    HealthCheckResponse,
    ReadinessResponse,
    SubsystemHealth,
)

router = APIRouter()


@router.get(
    "/health",
    response_model=HealthCheckResponse,
    summary="Application liveness probe",
    description="Returns basic application liveness without querying downstream databases.",
)
async def get_health() -> HealthCheckResponse:
    return HealthCheckResponse(
        status="healthy",
        timestamp=datetime.now(timezone.utc),
        version=settings.VERSION,
        phase=settings.PHASE,
        environment=settings.ENVIRONMENT,
    )


@router.get(
    "/readiness",
    response_model=ReadinessResponse,
    summary="Application readiness probe",
    description="Probes downstream subsystems (e.g. database) to determine if the lab is fully operational.",
)
async def get_readiness():
    db_result = await check_db_health(timeout_seconds=2.0)

    db_health = SubsystemHealth(
        name="database",
        status=db_result["status"],
        message=db_result["message"],
        target=db_result.get("target"),
        latency_ms=db_result.get("latency_ms"),
    )

    subsystems = {
        "database": db_health,
        "api": SubsystemHealth(
            name="api",
            status="operational",
            message="FastAPI application router and middleware active.",
            latency_ms=0.1,
        ),
    }

    is_ready = db_result["connected"]
    status_str = "ready" if is_ready else ("partially_ready" if not settings.DATABASE_URL else "not_ready")

    response_payload = ReadinessResponse(
        ready=is_ready,
        status=status_str,
        timestamp=datetime.now(timezone.utc),
        subsystems=subsystems,
    )

    # Return 200 even if degraded in dev/read-only mode so frontend can render honest status
    status_code = status.HTTP_200_OK if is_ready or not settings.is_production else status.HTTP_503_SERVICE_UNAVAILABLE

    return JSONResponse(
        status_code=status_code,
        content=response_payload.model_dump(mode="json"),
    )
