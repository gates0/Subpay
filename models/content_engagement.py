# → app/db/models/content_engagement.py

from datetime import datetime, timezone

import uuid

from sqlalchemy import UUID, DateTime, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.session import Base


class ContentView(Base):
    """
    Records one unique view per user per content item.
    A user re-opening the same content does not create a second row.
    """
    __tablename__ = "content_views"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    content_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("contents.id", ondelete="CASCADE"), nullable=False, index=True
    )
    viewed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    __table_args__ = (
        UniqueConstraint("user_id", "content_id", name="uq_content_view_user_content"),
    )

    user    = relationship("User",    back_populates="content_views")
    content = relationship("Content", back_populates="views")


class ContentLike(Base):
    """
    Records one like per user per content item.
    Toggled on/off via POST /content/{content_id}/like.
    """
    __tablename__ = "content_likes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    content_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("contents.id", ondelete="CASCADE"), nullable=False, index=True
    )
    liked_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    __table_args__ = (
        UniqueConstraint("user_id", "content_id", name="uq_content_like_user_content"),
    )

    user    = relationship("User",    back_populates="content_likes")
    content = relationship("Content", back_populates="likes")