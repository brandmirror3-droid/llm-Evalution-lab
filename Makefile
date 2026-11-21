.PHONY: help install test test-backend test-frontend dev-backend dev-frontend lint build clean

help:
	@echo "LLM Evaluation Lab — Available Commands:"
	@echo "  make install         Install backend and frontend dependencies"
	@echo "  make dev-backend     Start FastAPI backend server (127.0.0.1:8000)"
	@echo "  make dev-frontend    Start Vite frontend dev server (127.0.0.1:5173)"
	@echo "  make test            Run all backend and frontend tests"
	@echo "  make test-backend    Run pytest suite"
	@echo "  make test-frontend   Run vitest suite"
	@echo "  make lint            Run TypeScript checks"
	@echo "  make build           Build frontend production assets"
	@echo "  make migrate         Apply Alembic migrations to database"

install:
	cd backend && python3 -m venv venv && ./venv/bin/pip install --upgrade pip && ./venv/bin/pip install -r requirements.txt
	cd frontend && npm install

dev-backend:
	cd backend && ./venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

dev-frontend:
	cd frontend && npm run dev

test: test-backend test-frontend

test-backend:
	cd backend && ./venv/bin/pytest

test-frontend:
	cd frontend && npm test

lint:
	cd frontend && npm run lint

build:
	cd frontend && npm run build

migrate:
	cd backend && ./venv/bin/alembic upgrade head
