from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import verify_api_key
from app.database import get_db
from app.models.load import Load
from app.schemas.load import LoadOut, LoadsResponse
from app.services.load_service import search_loads

router = APIRouter(prefix="/api/v1/loads", tags=["loads"], dependencies=[Depends(verify_api_key)])


@router.get("", response_model=LoadsResponse)
async def get_loads(
    origin: str | None = Query(None, description="Filter by origin (partial match)"),
    destination: str | None = Query(None, description="Filter by destination (partial match)"),
    pickup_date_from: date | None = Query(None, description="Pickup on or after this date"),
    pickup_date_to: date | None = Query(None, description="Pickup on or before this date"),
    delivery_date_from: date | None = Query(None, description="Delivery on or after this date"),
    delivery_date_to: date | None = Query(None, description="Delivery on or before this date"),
    equipment_type: str | None = Query(None, description="Filter by equipment type"),
    limit: int = Query(20, ge=1, le=100, description="Max results to return"),
    offset: int = Query(0, ge=0, description="Number of results to skip"),
    db: AsyncSession = Depends(get_db),
) -> LoadsResponse:
    loads, total = await search_loads(
        db,
        origin=origin,
        destination=destination,
        pickup_date_from=pickup_date_from,
        pickup_date_to=pickup_date_to,
        delivery_date_from=delivery_date_from,
        delivery_date_to=delivery_date_to,
        equipment_type=equipment_type,
        limit=limit,
        offset=offset,
    )
    return LoadsResponse(
        loads=[LoadOut.model_validate(load) for load in loads],
        total=total,
        limit=limit,
        offset=offset,
    )


@router.get("/{load_id}", response_model=LoadOut)
async def get_load(
    load_id: str,
    db: AsyncSession = Depends(get_db),
) -> LoadOut:
    from sqlalchemy import select

    result = await db.execute(select(Load).where(Load.load_id == load_id))
    load = result.scalar_one_or_none()
    if not load:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Load not found")
    return LoadOut.model_validate(load)
