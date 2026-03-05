# → app/db/models/notification.py

from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.session import Base


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    # Who receives this notification
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )

    # Notification type — used by the frontend to decide icon/colour/routing
    # e.g. "new_subscriber" | "new_content" | "payment_success" |
    #       "payment_failed" | "subscription_cancelled" | "subscription_expiring" |
    #       "withdrawal_update"
    type: Mapped[str] = mapped_column(String(50), nullable=False, index=True)

    # Human-readable text sent to the user
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    body:  Mapped[str] = mapped_column(Text,        nullable=False)

    # Optional deep-link data so the frontend knows what to navigate to
    # e.g. entity_type="content"  entity_id=42 → /hubs/7/content/42
    #      entity_type="hub"      entity_id=7  → /hubs/7
    #      entity_type="transaction" entity_id=15 → /payments/history
    entity_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    entity_id:   Mapped[int | None] = mapped_column(Integer,    nullable=True)

    # Read state
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, index=True)

    # Timestamp
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True
    )

    # Relationship
    user = relationship("User", back_populates="notifications")