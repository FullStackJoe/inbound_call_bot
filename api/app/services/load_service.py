from datetime import date, datetime, time, timezone

from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.load import Load
from app.schemas.load import LoadCreate


async def search_loads(
    db: AsyncSession,
    *,
    origin: str | None = None,
    destination: str | None = None,
    pickup_date_from: date | None = None,
    pickup_date_to: date | None = None,
    delivery_date_from: date | None = None,
    delivery_date_to: date | None = None,
    equipment_type: str | None = None,
    limit: int = 20,
    offset: int = 0,
) -> tuple[list[Load], int]:
    query = select(Load).where(Load.status == "available")

    if origin:
        query = query.where(Load.origin.ilike(f"%{origin}%"))
    if destination:
        query = query.where(Load.destination.ilike(f"%{destination}%"))
    if pickup_date_from:
        dt = datetime.combine(pickup_date_from, time.min, tzinfo=timezone.utc)
        query = query.where(Load.pickup_datetime >= dt)
    if pickup_date_to:
        dt = datetime.combine(pickup_date_to, time.max, tzinfo=timezone.utc)
        query = query.where(Load.pickup_datetime <= dt)
    if delivery_date_from:
        dt = datetime.combine(delivery_date_from, time.min, tzinfo=timezone.utc)
        query = query.where(Load.delivery_datetime >= dt)
    if delivery_date_to:
        dt = datetime.combine(delivery_date_to, time.max, tzinfo=timezone.utc)
        query = query.where(Load.delivery_datetime <= dt)
    if equipment_type:
        query = query.where(func.lower(Load.equipment_type) == equipment_type.lower())

    count_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_query)).scalar_one()

    query = query.order_by(Load.pickup_datetime).offset(offset).limit(limit)
    result = await db.execute(query)
    loads = list(result.scalars().all())

    return loads, total


async def list_all_loads(
    db: AsyncSession,
    *,
    origin: str | None = None,
    destination: str | None = None,
    pickup_date_from: date | None = None,
    pickup_date_to: date | None = None,
    delivery_date_from: date | None = None,
    delivery_date_to: date | None = None,
    equipment_type: str | None = None,
    status: str | None = None,
    limit: int = 50,
    offset: int = 0,
) -> tuple[list[Load], int]:
    query = select(Load)

    if status:
        query = query.where(func.lower(Load.status) == status.lower())
    if origin:
        query = query.where(Load.origin.ilike(f"%{origin}%"))
    if destination:
        query = query.where(Load.destination.ilike(f"%{destination}%"))
    if pickup_date_from:
        dt = datetime.combine(pickup_date_from, time.min, tzinfo=timezone.utc)
        query = query.where(Load.pickup_datetime >= dt)
    if pickup_date_to:
        dt = datetime.combine(pickup_date_to, time.max, tzinfo=timezone.utc)
        query = query.where(Load.pickup_datetime <= dt)
    if delivery_date_from:
        dt = datetime.combine(delivery_date_from, time.min, tzinfo=timezone.utc)
        query = query.where(Load.delivery_datetime >= dt)
    if delivery_date_to:
        dt = datetime.combine(delivery_date_to, time.max, tzinfo=timezone.utc)
        query = query.where(Load.delivery_datetime <= dt)
    if equipment_type:
        query = query.where(func.lower(Load.equipment_type) == equipment_type.lower())

    count_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_query)).scalar_one()

    query = query.order_by(Load.pickup_datetime).offset(offset).limit(limit)
    result = await db.execute(query)
    loads = list(result.scalars().all())

    return loads, total


async def create_load(db: AsyncSession, data: LoadCreate) -> Load:
    load = Load(**data.model_dump())
    db.add(load)
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise
    await db.refresh(load)
    return load


async def delete_load(db: AsyncSession, load_id: str) -> Load | None:
    result = await db.execute(select(Load).where(Load.load_id == load_id))
    load = result.scalar_one_or_none()
    if not load:
        return None
    await db.delete(load)
    await db.commit()
    return load
