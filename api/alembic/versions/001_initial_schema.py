"""Initial schema - loads table

Revision ID: 001
Revises:
Create Date: 2026-04-08
"""

import sqlalchemy as sa
from alembic import op

revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "loads",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("load_id", sa.String(50), nullable=False),
        sa.Column("origin", sa.String(255), nullable=False),
        sa.Column("destination", sa.String(255), nullable=False),
        sa.Column("pickup_datetime", sa.DateTime(timezone=True), nullable=False),
        sa.Column("delivery_datetime", sa.DateTime(timezone=True), nullable=False),
        sa.Column("equipment_type", sa.String(50), nullable=False),
        sa.Column("loadboard_rate", sa.Numeric(10, 2), nullable=False),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("weight", sa.Integer(), nullable=True),
        sa.Column("commodity_type", sa.String(100), nullable=True),
        sa.Column("num_of_pieces", sa.Integer(), nullable=True),
        sa.Column("miles", sa.Integer(), nullable=True),
        sa.Column("dimensions", sa.String(100), nullable=True),
        sa.Column("status", sa.String(20), nullable=False, server_default="available"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("load_id"),
    )
    op.create_index("ix_loads_load_id", "loads", ["load_id"])
    op.create_index("ix_loads_origin", "loads", ["origin"])
    op.create_index("ix_loads_destination", "loads", ["destination"])
    op.create_index("ix_loads_pickup_datetime", "loads", ["pickup_datetime"])
    op.create_index("ix_loads_origin_dest_pickup", "loads", ["origin", "destination", "pickup_datetime"])


def downgrade():
    op.drop_index("ix_loads_origin_dest_pickup")
    op.drop_index("ix_loads_pickup_datetime")
    op.drop_index("ix_loads_destination")
    op.drop_index("ix_loads_origin")
    op.drop_index("ix_loads_load_id")
    op.drop_table("loads")
