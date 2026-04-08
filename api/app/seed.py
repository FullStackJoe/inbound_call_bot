import json
import logging
from datetime import datetime, timedelta, timezone
from pathlib import Path

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.load import Load

logger = logging.getLogger(__name__)

SEED_FILE = Path(__file__).parent.parent / "scripts" / "seed_data.json"


async def seed_loads(db: AsyncSession) -> None:
    count = (await db.execute(select(func.count()).select_from(Load))).scalar_one()
    if count > 0:
        logger.info("Database already has %d loads, skipping seed", count)
        return

    if not SEED_FILE.exists():
        logger.warning("Seed file not found at %s", SEED_FILE)
        return

    with open(SEED_FILE) as f:
        raw_loads = json.load(f)

    now = datetime.now(timezone.utc).replace(hour=8, minute=0, second=0, microsecond=0)

    for data in raw_loads:
        pickup_dt = now + timedelta(days=data.pop("pickup_datetime_offset_days"))
        delivery_dt = now + timedelta(days=data.pop("delivery_datetime_offset_days"))

        load = Load(
            pickup_datetime=pickup_dt,
            delivery_datetime=delivery_dt,
            **data,
        )
        db.add(load)

    await db.commit()
    logger.info("Seeded %d loads", len(raw_loads))
