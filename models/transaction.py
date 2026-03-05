# → app/db/models/transaction.py

from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.session import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    # Who paid
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )

    # What they paid for
    plan_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("plans.id", ondelete="CASCADE"), nullable=False, index=True
    )
    hub_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("hubs.id", ondelete="CASCADE"), nullable=False, index=True
    )

    # Linked subscription — NULL until payment is confirmed
    subscription_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("subscriptions.id", ondelete="SET NULL"), nullable=True, index=True
    )

    # Payment provider reference (e.g. Paystack reference string)
    reference: Mapped[str] = mapped_column(String(200), unique=True, nullable=False, index=True)

    # Financials — stored as NUMERIC to avoid float rounding
    amount:   Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    currency: Mapped[str]   = mapped_column(String(10),     nullable=False, default="NGN")

    # Status: "pending" | "success" | "failed"
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending", index=True)

    # Which provider processed this ("paystack" | "stripe")
    provider: Mapped[str] = mapped_column(String(30), nullable=False, default="paystack")

    # Raw JSON response stored as text for audit / debugging
    provider_response: Mapped[str | None] = mapped_column(Text, nullable=True)

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
    user = relationship("User", back_populates="transactions")
    plan = relationship("Plan", back_populates="transactions")
    hub = relationship("Hub", back_populates="transactions")
    subscription = relationship("Subscription", back_populates="transaction", uselist=False)