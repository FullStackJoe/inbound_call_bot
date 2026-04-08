# HappyRobot

Freight load management platform — a REST API for searching/managing freight loads and an admin UI for browsing the database.

## Structure

```
api/            FastAPI backend (Python 3.12, PostgreSQL, async SQLAlchemy)
database_ui/    React admin UI (Vite, TypeScript, shadcn/ui, Tailwind CSS)
deployment/     Docker Compose, Caddy config, deploy script
```

## What it does

- **API** exposes freight loads (origin, destination, dates, equipment type, rate, etc.) behind API key auth (`X-API-Key` header).
- **UI** connects to the API and lets you browse, filter, create, and delete loads in a table view. Requires the API key on first visit.
- On first startup, the database is seeded with sample freight loads from `api/scripts/seed_data.json`.

## Local development

```bash
cd deployment
docker compose -f docker-compose.dev.yml up
```

This starts PostgreSQL (5432), the API (8000), and the UI (5173). Open http://localhost:5173 and enter the API key to connect.

To run the API without Docker:

```bash
cd api
uv pip install -e ".[dev]"
uvicorn app.main:app --reload          # needs DATABASE_URL and API_KEY env vars
```

To run tests:

```bash
cd api
pytest
```

## Production deployment

Deployed to a Hetzner VPS via Docker Compose. Four containers: PostgreSQL, FastAPI, React UI (nginx), and Caddy (reverse proxy with automatic TLS).

Caddy routes `/api/*` to the API and everything else to the UI — both served on the same domain.

```bash
cd deployment
./deploy.sh <server-ip> <domain>
```

Prerequisites:
1. SSH access to the server (`ssh root@<ip>`)
2. DNS A record pointing `<domain>` to `<ip>`
3. A `.env` file in `api/` with production values (`API_KEY`, `POSTGRES_PASSWORD`, etc.)

## Environment variables

Set in `api/.env` (see `api/.env.example`):

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `API_KEY` | API authentication key |
| `POSTGRES_DB` | Database name |
| `POSTGRES_USER` | Database user |
| `POSTGRES_PASSWORD` | Database password |
| `DOMAIN` | Production domain (set by deploy script) |
