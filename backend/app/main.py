"""LLM Evaluation Lab — Backend Application Entrypoint.

Initializes FastAPI, configures middlewares, registers centralized error handlers,
and mounts versioned API routers.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.responses import JSONResponse

from app.api.v1.router import api_v1_router
from app.core.config import settings
from app.core.errors import register_error_handlers
from app.core.logging import RequestLoggingMiddleware, logger, setup_logging
from app.core.security import configure_security
from app.db.session import check_db_health, get_engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown lifecycle management."""
    setup_logging()
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION} [{settings.ENVIRONMENT}]")
    logger.info(f"Targeting roadmap: {settings.PHASE}")

    # Honest database startup check
    db_health = await check_db_health(timeout_seconds=2.0)
    if db_health["connected"]:
        logger.info(f"Database status: operational ({db_health.get('latency_ms')}ms)")
    else:
        logger.warning(
            f"Database status: {db_health['status']} - {db_health['message']}"
        )

    yield

    # Clean shutdown
    engine = get_engine()
    if engine:
        await engine.dispose()
        logger.info("Database engine connection pool closed.")
    logger.info("LLM Evaluation Lab backend shutdown complete.")


def create_app() -> FastAPI:
    """FastAPI application factory."""
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description=(
            "Research and model evaluation platform backend. "
            "Phase 1: Lab Foundation & Architecture."
        ),
        docs_url=f"{settings.API_V1_PREFIX}/docs" if settings.DEBUG else None,
        redoc_url=f"{settings.API_V1_PREFIX}/redoc" if settings.DEBUG else None,
        openapi_url=f"{settings.API_V1_PREFIX}/openapi.json" if settings.DEBUG else None,
        lifespan=lifespan,
    )

    # 1. Logging middleware
    app.add_middleware(RequestLoggingMiddleware)

    # 2. CORS and security headers
    configure_security(app)

    # 3. Centralized error handling
    register_error_handlers(app)

    # 4. Mount API v1 router
    app.include_router(api_v1_router, prefix=settings.API_V1_PREFIX)

    # 5. Root service metadata endpoint
    @app.get("/", include_in_schema=False)
    async def root():
        return JSONResponse(
            {
                "service": settings.PROJECT_NAME,
                "version": settings.VERSION,
                "phase": settings.PHASE,
                "environment": settings.ENVIRONMENT,
                "api_docs": f"{settings.API_V1_PREFIX}/docs" if settings.DEBUG else "disabled",
                "health_check": f"{settings.API_V1_PREFIX}/health",
                "status_audit": f"{settings.API_V1_PREFIX}/status",
            }
        )

    return app


app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.BACKEND_HOST,
        port=settings.BACKEND_PORT,
        reload=settings.DEBUG,
    )
