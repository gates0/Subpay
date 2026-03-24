from datetime import datetime, timezone

import uuid

from sqlalchemy import UUID, Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.session import Base


class Hub(Base):
    __tablename__ = "hubs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    # Every hub belongs to exactly one creator
    creator_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True
    )

    # Identity
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    banner_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

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

    # Relationships (referenced later by other modules)
    creator = relationship("User", back_populates="hub")
    plans = relationship("Plan", back_populates="hub", cascade="all, delete-orphan")
    subscribers = relationship("Subscription", back_populates="hub")
    contents = relationship("Content", back_populates="hub", cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="hub")
    withdrawals = relationship("Withdrawal", back_populates="hub")