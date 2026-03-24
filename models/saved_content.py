# → app/db/models/saved_content.py

from datetime import datetime, timezone

import uuid

from sqlalchemy import UUID, DateTime, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.session import Base


class SavedContent(Base):
    __tablename__ = "saved_contents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    # The member who saved this item
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )

    # The content that was saved
    content_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("contents.id", ondelete="CASCADE"), nullable=False, index=True
    )

    # When it was saved — used to order the bookmarks list newest-first
    saved_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # A user can only save a given piece of content once
    __table_args__ = (
        UniqueConstraint("user_id", "content_id", name="uq_saved_content_user_content"),
    )

    # Relationships
    user    = relationship("User", back_populates="saved_contents")
    content = relationship("Content", back_populates="saved_by")