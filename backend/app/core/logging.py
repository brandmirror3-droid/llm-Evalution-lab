"""Structured logging configuration for LLM Evaluation Lab.

Provides structured, readable, and security-safe logging without sensitive data leakage.
"""

import logging
import sys
import time
from typing import Callable
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.config import settings


def setup_logging() -> None:
    """Configure system-wide logging with appropriate format and level."""
    log_level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)

    log_format = (
        "%(asctime)s | %(levelname)-7s | %(name)s:%(lineno)d - %(message)s"
        if settings.DEBUG
        else '{"timestamp": "%(asctime)s", "level": "%(levelname)s", "module": "%(name)s", "message": "%(message)s"}'
    )

    logging.basicConfig(
        level=log_level,
        format=log_format,
        handlers=[logging.StreamHandler(sys.stdout)],
        force=True,
    )

    # Silence overly verbose third-party loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)


logger = logging.getLogger("eval_lab")


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware for structured request and latency logging."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start_time = time.perf_counter()
        method = request.method
        path = request.url.path
        query = request.url.query

        # Exclude high frequency health polling from spamming logs unless in debug
        is_health = path.endswith("/health") or path.endswith("/readiness")

        try:
            response = await call_next(request)
            duration_ms = round((time.perf_counter() - start_time) * 1000, 2)

            if not is_health or settings.DEBUG:
                logger.info(
                    f"{method} {path}{'?' + query if query else ''} -> {response.status_code} ({duration_ms}ms)"
                )
            return response
        except Exception as exc:
            duration_ms = round((time.perf_counter() - start_time) * 1000, 2)
            logger.error(
                f"{method} {path} failed with unhandled exception: {exc} ({duration_ms}ms)",
                exc_info=True,
            )
            raise exc
