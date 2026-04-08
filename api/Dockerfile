FROM python:3.12-slim AS builder

RUN pip install uv

WORKDIR /app
COPY pyproject.toml ./
RUN uv pip install --system --no-cache -r pyproject.toml

FROM python:3.12-slim

RUN useradd --create-home appuser
WORKDIR /app

COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin/uvicorn /usr/local/bin/uvicorn
COPY --from=builder /usr/local/bin/alembic /usr/local/bin/alembic

COPY alembic.ini ./
COPY alembic/ ./alembic/
COPY app/ ./app/
COPY scripts/ ./scripts/

USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
