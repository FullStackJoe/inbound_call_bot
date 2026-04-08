# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FastAPI REST API for freight load search in a freight brokerage platform. Fully async Python 3.12+ with SQLAlchemy 2.0+, PostgreSQL (asyncpg), and Alembic migrations.

## Commands

```bash
# Install dependencies
uv pip install -e ".[dev]"

# Run dev environment (PostgreSQL + API)
docker compose -f docker-compose.dev.yml up

# Run API locally (requires DATABASE_URL and API_KEY env vars)
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Run all tests
pytest

# Run single test file
pytest tests/test_loads.py

# Run single test
pytest tests/test_loads.py::test_get_loads_returns_available_only -v

# Database migrations
alembic revision --autogenerate -m "description"
alembic upgrade head
alembic downgrade -1

# Production deploy
./scripts/deploy.sh <hetzner-ip> <domain>
```

## Architecture

**Layered pattern:** routers → services → models/database. All I/O is async/await.

- `app/main.py` — FastAPI app with lifespan (creates tables + seeds data on startup)
- `app/routers/` — HTTP endpoints, query parameter validation, dependency injection
- `app/services/` — Business logic (query building, filtering, pagination)
- `app/models/` — SQLAlchemy ORM models (async)
- `app/schemas/` — Pydantic response models
- `app/database.py` — Async SQLAlchemy engine and session factory
- `app/config.py` — Pydantic Settings loading from environment/.env
- `app/auth.py` — API key auth via `X-API-Key` header (constant-time comparison)
- `alembic/` — Database migrations
- `scripts/seed_data.json` — Sample freight loads seeded on empty DB startup

## API

- **Base path:** `/api/v1/`
- **Auth:** `X-API-Key` header required on all endpoints except `GET /api/v1/health`
- **Endpoints:** `GET /api/v1/loads` (search with filters/pagination), `GET /api/v1/loads/{load_id}`
- Search only returns loads with `status == "available"`, ordered by `pickup_datetime` ascending

## Testing

Tests use **pytest-asyncio** with an in-memory SQLite database (aiosqlite) and httpx AsyncClient. Fixtures in `tests/conftest.py` provide `db_session` and `client`. All test functions are async (`asyncio_mode = "auto"`).

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql+asyncpg://happyrobot:happyrobot@db:5432/happyrobot` | Async DB connection string |
| `API_KEY` | `change-me-in-production` | API authentication key |
| `ENVIRONMENT` | `development` | Runtime environment |

## Key Conventions

- Python 3.10+ union syntax for types (`str | None` not `Optional[str]`)
- Type hints on all function signatures
- Async/await throughout — never use blocking I/O
- Pydantic for all request/response serialization
- FastAPI dependency injection for DB sessions and auth
- Origin/destination searches use case-insensitive partial matching (ILIKE)
- Equipment type uses case-insensitive exact match

## Deployment

Docker Compose with three services in production: PostgreSQL 16, FastAPI (non-root user), and Caddy reverse proxy (auto TLS). Dev compose omits Caddy and exposes ports directly.
