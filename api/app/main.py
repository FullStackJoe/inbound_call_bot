import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import async_session, engine
from app.models.load import Base
from app.routers.loads import router as loads_router
from app.seed import seed_loads

logging.basicConfig(level=logging.INFO)


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with async_session() as session:
        await seed_loads(session)
    yield
    await engine.dispose()


app = FastAPI(
    title="HappyRobot Loads API",
    description="Freight load search API for inbound carrier sales automation",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(loads_router)


@app.get("/api/v1/health", tags=["health"])
async def health():
    return {"status": "ok"}
