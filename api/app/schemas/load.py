from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field


class LoadCreate(BaseModel):
    load_id: str
    origin: str
    destination: str
    pickup_datetime: datetime
    delivery_datetime: datetime
    equipment_type: str
    loadboard_rate: Decimal = Field(decimal_places=2, max_digits=10)
    notes: str | None = None
    weight: int | None = None
    commodity_type: str | None = None
    num_of_pieces: int | None = None
    miles: int | None = None
    dimensions: str | None = None
    status: str = "available"


class LoadOut(BaseModel):
    load_id: str
    origin: str
    destination: str
    pickup_datetime: datetime
    delivery_datetime: datetime
    equipment_type: str
    loadboard_rate: Decimal
    notes: str | None
    weight: int | None
    commodity_type: str | None
    num_of_pieces: int | None
    miles: int | None
    dimensions: str | None
    status: str

    model_config = {"from_attributes": True}


class LoadsResponse(BaseModel):
    loads: list[LoadOut]
    total: int
    limit: int
    offset: int
