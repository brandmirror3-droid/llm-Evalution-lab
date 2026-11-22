"""Centralized error handling and standardized error envelopes.

Ensures predictable, machine-readable API error structures across all endpoints.
"""

from typing import Any, Dict, Optional
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy.exc import SQLAlchemyError

from app.core.logging import logger


class LabException(Exception):
    """Base application exception for LLM Evaluation Lab."""

    def __init__(
        self,
        message: str,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        code: str = "LAB_ERROR",
        details: Optional[Dict[str, Any]] = None,
    ):
        self.message = message
        self.status_code = status_code
        self.code = code
        self.details = details or {}
        super().__init__(self.message)


class EntityNotFoundException(LabException):
    """Raised when a requested resource does not exist."""

    def __init__(self, entity_type: str, entity_id: str):
        super().__init__(
            message=f"{entity_type} with ID '{entity_id}' was not found.",
            status_code=status.HTTP_404_NOT_FOUND,
            code="ENTITY_NOT_FOUND",
            details={"entity_type": entity_type, "entity_id": entity_id},
        )


class DatabaseUnavailableException(LabException):
    """Raised when an operation requires the database, but it is unconfigured or unreachable."""

    def __init__(self, message: str = "Database connection is unconfigured or currently unavailable."):
        super().__init__(
            message=message,
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            code="DATABASE_UNAVAILABLE",
            details={"resolution": "Configure DATABASE_URL and run migrations via alembic upgrade head."},
        )


class PhaseNotImplementedException(LabException):
    """Raised when a route or action belongs to a planned future roadmap phase."""

    def __init__(self, feature_name: str, planned_phase: int, phase_title: str):
        super().__init__(
            message=f"Feature '{feature_name}' is planned for Phase {planned_phase} ({phase_title}) and is not available in Phase 1.",
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            code="PHASE_NOT_IMPLEMENTED",
            details={
                "feature": feature_name,
                "planned_phase": planned_phase,
                "phase_title": phase_title,
                "current_phase": 1,
            },
        )


def register_error_handlers(app: FastAPI) -> None:
    """Register custom exception handlers with FastAPI app."""

    @app.exception_handler(LabException)
    async def lab_exception_handler(request: Request, exc: LabException):
        logger.warning(f"LabException on {request.url.path}: [{exc.code}] {exc.message}")
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": {
                    "code": exc.code,
                    "message": exc.message,
                    "details": exc.details,
                    "path": request.url.path,
                }
            },
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        logger.warning(f"Validation error on {request.url.path}: {exc.errors()}")
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": "Input validation failed. Check request body and parameters.",
                    "details": exc.errors(),
                    "path": request.url.path,
                }
            },
        )

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": {
                    "code": f"HTTP_{exc.status_code}",
                    "message": exc.detail,
                    "details": {},
                    "path": request.url.path,
                }
            },
        )

    @app.exception_handler(SQLAlchemyError)
    async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
        logger.warning(f"Database error on {request.url.path}: {exc}")
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "error": {
                    "code": "DATABASE_UNAVAILABLE",
                    "message": "Database is unreachable or encountered a connection error. Verify PostgreSQL server is running.",
                    "details": {
                        "error_type": type(exc).__name__,
                        "resolution": "Configure DATABASE_URL in backend/.env and ensure database service is active.",
                    },
                    "path": request.url.path,
                }
            },
        )

    @app.exception_handler(OSError)
    async def os_error_handler(request: Request, exc: OSError):
        logger.warning(f"Network/socket error on {request.url.path}: {exc}")
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "error": {
                    "code": "SERVICE_UNAVAILABLE",
                    "message": "Subsystem connection failed or network socket unavailable.",
                    "details": {
                        "error_type": type(exc).__name__,
                        "resolution": "Verify target service is running on configured host and port.",
                    },
                    "path": request.url.path,
                }
            },
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled server error on {request.url.path}: {exc}", exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": {
                    "code": "INTERNAL_SERVER_ERROR",
                    "message": "An unexpected server error occurred. Please consult backend logs.",
                    "details": {"type": type(exc).__name__},
                    "path": request.url.path,
                }
            },
        )
