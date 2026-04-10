# → app/db/models/plan.py

from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.session import Base


class Plan(Base):
    __tablename__ = "plans"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    # Every plan belongs to one hub
    hub_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("hubs.id", ondelete="CASCADE"), nullable=False, index=True
    )

    # Identity
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Pricing — stored as NUMERIC to avoid floating point issues
    price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(10), nullable=False, default="USD")

    # Billing cycle: "monthly" | "yearly" | "one_time"
    billing_cycle: Mapped[str] = mapped_column(String(20), nullable=False, default="monthly")

    # Status
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

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
    hub = relationship("Hub", back_populates="plans")
    subscribers = relationship("Subscription", back_populates="plan")
    contents = relationship("Content", secondary="content_plans", back_populates="plans")
    transactions = relationship("Transaction", back_populates="plan")