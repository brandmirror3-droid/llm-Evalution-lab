# LLM Evaluation Lab — Phase 1: Lab Foundation & Architecture

[![Architecture: Phase 1 Active](https://img.shields.io/badge/Roadmap-Phase_1_Active-lime.svg)](#roadmap--development-status)
[![Backend: FastAPI](https://img.shields.io/badge/Backend-FastAPI_0.115-009688.svg)](https://fastapi.tiangolo.com)
[![Frontend: React + Vite](https://img.shields.io/badge/Frontend-React_18_%2B_Vite-61DAFB.svg)](https://vitejs.dev)
[![Database: SQLAlchemy + PostgreSQL](https://img.shields.io/badge/Database-SQLAlchemy_2_%2B_Alembic-336791.svg)](https://www.sqlalchemy.org)
[![Testing: Pytest + Vitest](https://img.shields.io/badge/Tests-100%25_Passing-emerald.svg)](#testing)

An enterprise-grade, research-oriented AI evaluation and testing platform designed to systematically evaluate, benchmark, stress-test, and investigate the reliability, hallucination patterns, and intelligence limits of Large Language Models.

---

## 1. Product Vision & Mission

**LLM Evaluation Lab** is not a generic AI chatbot and not a vanity metrics dashboard. It is a scientific testing environment engineered for AI researchers, ML platform engineers, and evaluation teams.

The platform is designed to support:
- Multi-model playground benchmarking
- Deterministic and semantic scoring engines
- Hallucination detection & citation verification
- Failure case taxonomy and error clustering
- Adversarial robustness & jailbreak testing
- Confidence, calibration, and uncertainty analysis
- Continuous regression evaluation across model checkpoints

### 12-Phase Roadmap Overview

| Phase | Milestone Title | Status |
| :--- | :--- | :--- |
| **Phase 1** | **Lab Foundation & Architecture** | **Completed & Verified** |
| Phase 2 | Model Playground & Integration | Planned |
| Phase 3 | Benchmark & Dataset Engine | Planned |
| Phase 4 | Evaluation & Scoring Engine | Planned |
| Phase 5 | Hallucination Detection Engine | Planned |
| Phase 6 | Failure Analysis & Error Intelligence | Planned |
| Phase 7 | Adversarial & Robustness Testing | Planned |
| Phase 8 | Model Intelligence & Comparative Analytics | Planned |
| Phase 9 | Confidence, Calibration & Reliability | Planned |
| Phase 10 | Regression & Continuous Evaluation | Planned |
| Phase 11 | AI Evaluation Agent & Test Generation | Planned |
| Phase 12 | Research Intelligence & Final Lab | Planned |

> **Note on Phase 1 Scope:** Only Phase 1 is implemented. All future modules (Phases 2–12) have structured architectural placeholders with execution gates that strictly reject premature mock executions. Synthetic benchmarks and simulated scores are strictly forbidden by architectural design.

---

## 2. Architecture & Monorepo Structure

```
llm-evaluation-lab/
├── .env.example              # Central environment variables template
├── .gitignore                # Multi-language exclusion rules (Python, Node, DB)
├── Makefile                  # Developer workflow automation
├── README.md                 # Project guide & operations
├── ARCHITECTURE.md           # Deep-dive architectural specification
│
├── backend/                  # FastAPI Application
│   ├── pyproject.toml        # Backend project metadata & test configurations
│   ├── requirements.txt      # Pinned production & dev dependencies
│   ├── .env.example          # Backend-specific environment template
│   ├── alembic.ini           # Alembic database migration configuration
│   ├── alembic/
│   │   ├── env.py            # Async SQLAlchemy migration runtime
│   │   └── versions/
│   │       └── 0001_initial_foundation.py # Workspaces, Projects, SystemSettings
│   ├── app/
│   │   ├── main.py           # Application factory, lifespan, and middlewares
│   │   ├── core/
│   │   │   ├── config.py     # Pydantic Settings & credential masking
│   │   │   ├── logging.py    # Structured logging & request telemetry
│   │   │   ├── security.py   # Security headers & strict CORS policies
│   │   │   └── errors.py     # Centralized error handlers & custom exceptions
│   │   ├── db/
│   │   │   ├── base.py       # Declarative base & timestamp mixins
│   │   │   └── session.py    # Async engine, session dependency, live probes
│   │   ├── models/           # SQLAlchemy 2.0 mapped models
│   │   │   ├── workspace.py  # Workspace entity
│   │   │   ├── project.py    # Project entity
│   │   │   └── system_setting.py # Key-value lab settings
│   │   ├── schemas/          # Pydantic DTOs & response envelopes
│   │   │   ├── common.py     # ResponseEnvelope[T], pagination, roadmap meta
│   │   │   ├── health.py     # Subsystem health, liveness, readiness, status
│   │   │   └── workspace.py  # Workspace validation schemas
│   │   └── api/
│   │       └── v1/
│   │           ├── router.py # Aggregated API v1 router
│   │           └── endpoints/
│   │               ├── health.py       # /health & /readiness probes
│   │               ├── status.py       # /status lab audit telemetry
│   │               ├── workspaces.py   # /workspaces foundational CRUD
│   │               └── placeholders.py # /modules roadmap specifications
│   └── tests/
│       ├── conftest.py       # Pytest async SQLite fixtures & app clients
│       ├── test_config.py    # Configuration & secret masking tests
│       ├── test_errors.py    # Error handling & phase-gate tests
│       ├── test_health.py    # Liveness, readiness, and status probes
│       └── test_workspaces.py# Workspace CRUD & slug conflict tests
│
└── frontend/                 # React 18 + Vite + TypeScript Application
    ├── package.json          # Node dependencies & build scripts
    ├── tsconfig.json         # Strict TypeScript configuration
    ├── vite.config.ts        # Vite configuration with API dev proxy
    ├── tailwind.config.js    # Custom laboratory dark-mode design tokens
    ├── index.html            # Research laboratory entry page
    └── src/
        ├── main.tsx          # React application root
        ├── App.tsx           # Router & layout declarations
        ├── index.css         # Tailwind directives & research styling
        ├── types/            # TypeScript domain interfaces
        ├── api/
        │   ├── client.ts     # Typed resilient fetch client
        │   └── system.ts     # Telemetry & workspace API hooks
        ├── components/
        │   ├── layout/       # Shell, Sidebar, Header, PageContainer
        │   ├── ui/           # Badge, Button, Card, EmptyState, Modal, Tabs, StatusIndicator
        │   └── modules/      # PlannedModulePlaceholder
        ├── pages/
        │   ├── Overview/     # Honest empty-state research dashboard
        │   ├── FutureModules/# Elegant placeholders for future roadmap phases
        │   ├── Settings/     # Environment parameters & workspace management
        │   └── NotFoundPage.tsx # Standardized 404 handler
        └── tests/
            ├── setup.ts      # Test setup & DOM matchers
            └── Shell.test.tsx# Shell layout & overview unit tests
```

---

## 3. Quick Start & Development Setup

### Prerequisites
- **Node.js**: >= 18.0.0 (Tested on Node v24.18.0)
- **Python**: >= 3.11 (Tested on Python 3.14.6)
- **PostgreSQL**: Optional for initial startup. The platform gracefully operates in degraded mode and honestly reports its status if PostgreSQL is awaiting setup.

### Installation

1. **Clone the repository:**
   ```bash
   cd "/Users/mac/Desktop/llm Evalution lab"
   ```

2. **Initialize environment configuration:**
   ```bash
   cp .env.example .env
   cp .env.example backend/.env
   ```

3. **Install Backend Dependencies:**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install --upgrade pip
   pip install -r requirements.txt
   cd ..
   ```

4. **Install Frontend Dependencies:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

---

## 4. Running the Development Servers

You can run both services concurrently using the root `Makefile` or individual terminal tabs:

### Option A: Using the Makefile
```bash
make dev-backend   # Starts FastAPI on http://127.0.0.1:8000
make dev-frontend  # Starts Vite on http://127.0.0.1:5173
```

### Option B: Terminal Commands

**Terminal 1 (Backend):**
```bash
cd backend
./venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser. The frontend proxy will automatically route all `/api/v1` traffic to the FastAPI backend.

---

## 5. Database Setup & Migrations

If you have a running PostgreSQL instance:
1. Update `DATABASE_URL` in `backend/.env`:
   ```env
   DATABASE_URL=postgresql+asyncpg://<username>:<password>@localhost:5432/llm_eval_lab
   ```
2. Apply the foundational schema migration:
   ```bash
   cd backend
   ./venv/bin/alembic upgrade head
   ```

### Degraded Mode & Honest Telemetry
If PostgreSQL is offline or unconfigured:
- The backend starts without crashing.
- Live `/api/v1/health` and `/api/v1/status` probes report `database: not_configured` or `database: disconnected`.
- The frontend Overview dashboard surfaces an honest status badge: **Awaiting setup** with setup instructions.
- Workspaces endpoints return structured `503 DATABASE_UNAVAILABLE` errors with clear remediation steps.

---

## 6. Testing

Both the backend and frontend include automated test suites.

### Run Backend Tests (Pytest)
```bash
cd backend
./venv/bin/pytest
```
*Result: 11 tests verifying health probes, status telemetry, secret masking, error envelopes, phase-action rejection gates, and isolated SQLite database workspace CRUD.*

### Run Frontend Tests (Vitest)
```bash
cd frontend
npm test
```
*Result: Unit tests verifying shell brand rendering, navigation hierarchy, honest empty states, and mock status integration.*

### Build Frontend Production Bundle
```bash
cd frontend
npm run build
```
*Result: Compiles TypeScript and packages optimized production assets with zero errors.*

---

## 7. Security Architecture & Controls

- **No Secrets Exposed**: API keys (`OPENAI_API_KEY`, etc.) are checked by the backend only to report configuration booleans to the UI. The actual key values are never returned by any endpoint or logged.
- **Connection String Masking**: `DATABASE_URL` credentials (`user:password`) are automatically masked as `***:***` in all diagnostics.
- **Defensive HTTP Headers**: Enforces `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection`, and `Permissions-Policy`.
- **CORS Policies**: Explicit origin validation restricted to authorized development and production origins.
- **Input Validation**: Strict request payload schema validation using Pydantic v2.

---

## 8. Current Implementation Status & Limitations

### Verified in Phase 1
- [x] Full-stack monorepo foundation with clean separation of concerns.
- [x] Versioned FastAPI backend (`/api/v1`) with structured logging, security headers, and error envelopes.
- [x] SQLAlchemy 2.0 async engine and Alembic migration foundation.
- [x] Real-time health probes (`/api/v1/health`, `/api/v1/readiness`, `/api/v1/status`).
- [x] Dark-first research laboratory design system (charcoal/graphite surfaces, lime accents, Lucide SVG icons).
- [x] Responsive collapsible sidebar with active route states and mobile drawer.
- [x] Honest research overview dashboard with live probed system states and zero fake metrics.
- [x] Purposeful research workspace empty states (experiments, runs, failures, benchmarks).
- [x] Roadmap specifications and strict execution gates for future modules (Phases 2–12).
- [x] Comprehensive test suites (11 backend tests + frontend test suite).

### Documented Limitations
- **No Model Execution**: Model API calls and prompt completion streaming are scheduled for Phase 2.
- **Authentication**: Phase 1 operates in single-tenant research mode. JWT/RBAC user authentication is scheduled for an enterprise milestone.
- **PostgreSQL Dependency for Workspaces**: Custom workspace creation requires a live PostgreSQL instance; if unconfigured, the UI clearly displays instructions.

---

## 9. Phase 2 Readiness

Phase 1 provides the complete foundation required for **Phase 2 — Model Playground & Integration**:
- API router structure is ready to mount `/api/v1/models` and `/api/v1/playground`.
- Sidebar and router have dedicated routes (`/playground`, `/experiments`).
- Provider credential telemetry is already implemented in `backend/app/core/config.py`.
