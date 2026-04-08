# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Freight load management platform with two parts:
- **`api/`** — FastAPI REST API (Python 3.12+, async SQLAlchemy 2.0+, PostgreSQL, Alembic)
- **`database_ui/`** — React admin UI for viewing/creating/deleting loads (Vite + TypeScript + shadcn/ui + Tailwind CSS)

## Commands

### Backend (run from `api/`)

```bash
uv pip install -e ".[dev]"                          # Install dependencies
docker compose -f docker-compose.dev.yml up         # Run full dev stack (DB + API + UI)
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload  # Run API standalone
pytest                                              # Run all tests
pytest tests/test_loads.py::test_create_load -v     # Run single test
alembic upgrade head                                # Apply migrations
./scripts/deploy.sh <hetzner-ip> <domain>           # Production deploy
```

### Frontend (run from `database_ui/`)

```bash
npm install              # Install dependencies
npm run dev              # Dev server on http://localhost:5173
npm run build            # Production build
npx tsc --noEmit         # Type-check
```

## Architecture

**Layered pattern:** routers → services → models/database. All I/O is async/await.

- `api/app/main.py` — FastAPI app with lifespan (creates tables + seeds data on startup)
- `api/app/routers/` — HTTP endpoints, query parameter validation, dependency injection
- `api/app/services/` — Business logic (query building, filtering, pagination)
- `api/app/models/` — SQLAlchemy ORM models (async)
- `api/app/schemas/` — Pydantic response models
- `api/app/database.py` — Async SQLAlchemy engine and session factory
- `api/app/config.py` — Pydantic Settings loading from environment/.env
- `api/app/auth.py` — API key auth via `X-API-Key` header (constant-time comparison)
- `api/app/seed.py` — Seeds DB from `scripts/seed_data.json` on empty DB startup
- `api/alembic/` — Database migrations

## API

- **Base path:** `/api/v1/`
- **Auth:** `X-API-Key` header required on all endpoints except `GET /api/v1/health`
- **Endpoints:**
  - `GET /api/v1/loads` — search available loads with filters/pagination
  - `GET /api/v1/loads/all` — list all loads (any status), used by the UI
  - `POST /api/v1/loads` — create a load (returns 201, or 409 on duplicate load_id)
  - `DELETE /api/v1/loads/{load_id}` — delete a load
  - `GET /api/v1/loads/{load_id}` — get single load
- `GET /loads` only returns `status == "available"` loads; `GET /loads/all` returns all statuses
- Route ordering matters: `/all` is declared before `/{load_id}` in the router

## Testing

Tests use **pytest-asyncio** with an in-memory SQLite database (aiosqlite) and httpx AsyncClient. Fixtures in `api/tests/conftest.py` provide `db_session` and `client`. All test functions are async (`asyncio_mode = "auto"`).

## Key Conventions

- Python 3.10+ union syntax for types (`str | None` not `Optional[str]`)
- Type hints on all function signatures
- Async/await throughout — never use blocking I/O
- Pydantic for all request/response serialization
- FastAPI dependency injection for DB sessions and auth
- Origin/destination searches use case-insensitive partial matching (ILIKE)
- Equipment type uses case-insensitive exact match

## Frontend Architecture

- **Vite + React + TypeScript** with **shadcn/ui** components and **Tailwind CSS v4**
- `database_ui/src/api/` — API client with `X-API-Key` auth from `sessionStorage`
- `database_ui/src/components/` — UI components (LoadsTable, FilterBar, CreateLoadDialog, DeleteConfirmDialog)
- `database_ui/src/hooks/useLoads.ts` — Data fetching hook with filtering/pagination state
- Login flow: user enters API key, validated against the API, stored in `sessionStorage`

## Deployment

Docker Compose with three services in production: PostgreSQL 16, FastAPI (non-root user), and Caddy reverse proxy (auto TLS). Dev compose adds a fourth service for the React UI on port 5173.
