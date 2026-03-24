# → app/db/models/withdrawal.py

from datetime import datetime, timezone

import uuid

from sqlalchemy import UUID, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.session import Base


class Withdrawal(Base):
    __tablename__ = "withdrawals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    # Which creator requested the payout
    creator_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    hub_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("hubs.id", ondelete="CASCADE"), nullable=False, index=True
    )

    # Amount requested
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(10), nullable=False, default="NGN")

    # Status: "pending" | "processing" | "completed" | "failed"
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending", index=True)

    # Bank / payout details snapshot at time of request
    bank_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    account_number: Mapped[str | None] = mapped_column(String(30), nullable=True)
    account_name: Mapped[str | None] = mapped_column(String(100), nullable=True)

    # Optional admin note (e.g. rejection reason)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    creator = relationship("User", back_populates="withdrawals")
    hub = relationship("Hub", back_populates="withdrawals")