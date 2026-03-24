# → app/db/models/subscription.py

from datetime import datetime, timezone

import uuid

from sqlalchemy import UUID, Boolean, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.session import Base


class Subscription(Base):
    __tablename__ = "subscriptions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    # The member who subscribed
    member_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )

    # The hub they subscribed to
    hub_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("hubs.id", ondelete="CASCADE"), nullable=False, index=True
    )

    # The specific plan they chose
    plan_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("plans.id", ondelete="CASCADE"), nullable=False, index=True
    )

    # Status: "active" | "cancelled" | "expired"
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="active", index=True)

    # Whether auto-renew is enabled
    auto_renew: Mapped[bool] = mapped_column(Boolean, default=True)

    # Billing window
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    cancelled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

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
    member = relationship("User", back_populates="subscriptions")
    hub = relationship("Hub", back_populates="subscribers")
    plan = relationship("Plan", back_populates="subscribers")
    transaction = relationship("Transaction", back_populates="subscription", uselist=False)