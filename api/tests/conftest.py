from collections.abc import AsyncGenerator
from datetime import datetime, timedelta, timezone

import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.main import app
from app.models.load import Base, Load
from app.database import get_db


@pytest_asyncio.fixture
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    engine = create_async_engine("sqlite+aiosqlite:///:memory:")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with session_factory() as session:
        now = datetime.now(timezone.utc)
        test_loads = [
            Load(
                load_id="TEST-001",
                origin="Chicago, IL",
                destination="Dallas, TX",
                pickup_datetime=now + timedelta(days=1),
                delivery_datetime=now + timedelta(days=3),
                equipment_type="Dry Van",
                loadboard_rate=2850.00,
                weight=38000,
                commodity_type="Electronics",
                num_of_pieces=24,
                miles=920,
                dimensions="48x40x48 in",
                notes="Test load 1",
                status="available",
            ),
            Load(
                load_id="TEST-002",
                origin="Atlanta, GA",
                destination="Miami, FL",
                pickup_datetime=now + timedelta(days=2),
                delivery_datetime=now + timedelta(days=3),
                equipment_type="Reefer",
                loadboard_rate=2200.00,
                weight=42000,
                commodity_type="Produce",
                num_of_pieces=1100,
                miles=660,
                dimensions="Palletized",
                notes="Test load 2",
                status="available",
            ),
            Load(
                load_id="TEST-003",
                origin="Chicago, IL",
                destination="Detroit, MI",
                pickup_datetime=now + timedelta(days=5),
                delivery_datetime=now + timedelta(days=6),
                equipment_type="Flatbed",
                loadboard_rate=1100.00,
                weight=43000,
                commodity_type="Building Materials",
                num_of_pieces=12,
                miles=280,
                dimensions="24 ft lengths",
                notes="Test load 3",
                status="booked",
            ),
        ]
        session.add_all(test_loads)
        await session.commit()
        yield session

    await engine.dispose()


@pytest_asyncio.fixture
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.clear()
