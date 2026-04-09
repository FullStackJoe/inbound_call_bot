# Acme Logistics

Freight load management platform — FastAPI + React + PostgreSQL.

## Deploy

SSH into the server, pull latest, then:

```bash
cd deployment
docker compose down -v        # tear down + wipe DB (forces re-seed)
docker compose up -d --build  # rebuild and start all services
```

`-v` removes the DB volume so seed data is re-applied on startup.

## Local Dev

```bash
cd deployment
docker compose -f docker-compose.dev.yml up
```

Exposes: API on `:8000`, UI on `:5173`, DB on `:5432`.
