# LLM Evaluation Lab — Architecture & System Design

## 1. Architectural Philosophy

LLM Evaluation Lab is designed according to three fundamental engineering principles:

1. **Truth Over Simulation**: We never fabricate accuracy figures, hallucination rates, model rankings, or synthetic experiment counters. If a subsystem or database is unconfigured, the system reports its state honestly.
2. **Modular Layering**: Presentation, business logic, validation, telemetry, and persistence are strictly decoupled to allow independent scaling and future phase integration without architectural rewrites.
3. **Phase-Gated Evolution**: The 12-phase product roadmap is supported by foundational entities and router namespaces from day one, while premature execution of future engines is strictly guarded.

---

## 2. High-Level Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Browser Client                       │
│     React 18 + TypeScript + Vite + Tailwind CSS        │
└───────────────────────────┬────────────────────────────┘
                            │
                            │ HTTP / JSON (REST)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   FastAPI Backend                      │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │                Middleware Pipeline               │  │
│  │  - Request Logging & Latency Telemetry           │  │
│  │  - Defensive Security Headers (CSP, Frame, XSS)  │  │
│  │  - Strict Origin CORS Handling                   │  │
│  └──────────────────────────┬───────────────────────┘  │
│                             │                          │
│  ┌──────────────────────────▼───────────────────────┐  │
│  │               Centralized Error Handler          │  │
│  │  - Standardized JSON Error Envelopes             │  │
│  │  - Phase Gate Rejections (HTTP 501)              │  │
│  │  - Database Availability Handlers (HTTP 503)     │  │
│  └──────────────────────────┬───────────────────────┘  │
│                             │                          │
│  ┌──────────────────────────▼───────────────────────┐  │
│  │               Versioned API Router (/api/v1)     │  │
│  │  ├── /health & /readiness (Live Probes)          │  │
│  │  ├── /status (Comprehensive Lab Diagnostics)     │  │
│  │  ├── /workspaces (CRUD & Multi-Tenancy Seed)     │  │
│  │  └── /modules (Roadmap Registry & Gates)         │  │
│  └──────────────────────────┬───────────────────────┘  │
│                             │                          │
│  ┌──────────────────────────▼───────────────────────┐  │
│  │             Persistence & Health Probe           │  │
│  │  - SQLAlchemy 2.0 Async Engine (asyncpg)         │  │
│  │  - Connection Pre-ping & Latency Benchmarks      │  │
│  │  - Credential Masking in Telemetry               │  │
│  └──────────────────────────┬───────────────────────┘  │
└─────────────────────────────┼──────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────┐
│               PostgreSQL Database (Async)              │
│    Alembic Revisions: Workspaces, Projects, Settings   │
└────────────────────────────────────────────────────────┘
```

---

## 3. Layer Responsibilities

### Frontend Architecture
- **Application Shell (`Shell.tsx`)**: Controls global navigation, sidebar state, active route detection, and header breadcrumbs.
- **State & Data Fetching**: Decoupled typed API client (`client.ts`) that standardizes network errors and parses custom `ApiError` payloads.
- **Design Tokens**: Custom dark-first graphite palette configured in `tailwind.config.js`, providing high-contrast readability without visual fatigue.
- **Future Module Placeholders (`PlannedModulePlaceholder.tsx`)**: Reusable component that surfaces roadmap specifications, target capabilities, and includes a verification gate to confirm that unverified executions remain locked.

### Backend Architecture
- **Config Management (`core/config.py`)**: Built on `pydantic-settings.BaseSettings`. Reads environment variables, validates URLs and origins, and provides safe credential-masking helpers.
- **Error Handling (`core/errors.py`)**: Custom hierarchy inheriting from `LabException`. Automatically serializes errors into `{ error: { code, message, details, path } }`.
- **Database Abstraction (`db/session.py`)**: Supports asynchronous connection pooling via `asyncpg`. Exposes `check_db_health(timeout_seconds)` which probes `SELECT 1` without throwing unhandled exceptions when PostgreSQL is offline.
- **Data Models (`models/`)**:
  - `Workspace`: Top-level organizational container for experiments and evaluations.
  - `Project`: Initiative grouping within a workspace.
  - `SystemSetting`: Key-value storage for environment preferences and feature flags.

---

## 4. Database Schema (Phase 1 Baseline)

```mermaid
erDiagram
    WORKSPACES ||--o{ PROJECTS : contains
    WORKSPACES {
        string id PK "UUID"
        string name "Workspace name"
        string slug UK "Unique URL slug"
        text description "Optional description"
        boolean is_default "Default flag"
        datetime created_at "UTC timestamp"
        datetime updated_at "UTC timestamp"
    }
    PROJECTS {
        string id PK "UUID"
        string workspace_id FK "References workspaces.id"
        string name "Project name"
        string slug "Project slug"
        text description "Optional description"
        datetime created_at "UTC timestamp"
        datetime updated_at "UTC timestamp"
    }
    SYSTEM_SETTINGS {
        string key PK "Setting key identifier"
        text value "Config value"
        text description "Documentation"
        boolean is_secret "Credential flag"
        datetime updated_at "UTC timestamp"
    }
```

---

## 5. Security Architecture

1. **API Key Hygiene**: Model provider keys (`OPENAI_API_KEY`, etc.) are never delivered to the client or embedded in client bundles. The backend inspects their existence solely to report boolean configuration flags.
2. **Defensive Headers**: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Referrer-Policy: strict-origin-when-cross-origin` prevent clickjacking, MIME-sniffing, and cross-site leaks.
3. **CORS Hardening**: Cross-Origin requests are explicitly restricted to configured domain origins (`CORS_ORIGINS`).
4. **Credential Masking**: Any database URL containing sensitive username and password components is scrubbed before being exposed in status payloads (`postgresql+asyncpg://***:***@host:5432/db`).

---

## 6. Phase 2–12 Extensibility Blueprint

The architecture is explicitly pre-configured to receive subsequent modules without breaking changes:
- **Phase 2 (Playground)**: Will mount router under `/api/v1/playground` and introduce provider adapter abstractions in `backend/app/services/providers/`.
- **Phase 3 (Benchmarks & Datasets)**: Will introduce `Dataset` and `BenchmarkSuite` models with Alembic migrations, utilizing the existing `Workspace` foreign keys.
- **Phase 4 (Evaluation Engine)**: Will implement asynchronous worker task queues for deterministic and LLM-as-a-judge scoring rubrics.
- **Phase 6 (Failure Analysis)**: Will introduce error taxonomy tables connected to evaluation run results.
