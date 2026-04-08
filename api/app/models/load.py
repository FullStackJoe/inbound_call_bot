from datetime import datetime, timezone

from sqlalchemy import DateTime, Index, Integer, Numeric, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class Load(Base):
    __tablename__ = "loads"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    load_id: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    origin: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    destination: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    pickup_datetime: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, index=True
    )
    delivery_datetime: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    equipment_type: Mapped[str] = mapped_column(String(50), nullable=False)
    loadboard_rate: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    weight: Mapped[int | None] = mapped_column(Integer, nullable=True)
    commodity_type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    num_of_pieces: Mapped[int | None] = mapped_column(Integer, nullable=True)
    miles: Mapped[int | None] = mapped_column(Integer, nullable=True)
    dimensions: Mapped[str | None] = mapped_column(String(100), nullable=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="available")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    __table_args__ = (
        Index("ix_loads_origin_dest_pickup", "origin", "destination", "pickup_datetime"),
    )
