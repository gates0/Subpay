# → app/db/models/comment.py

from datetime import datetime, timezone

import uuid

from sqlalchemy import UUID, Boolean, DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.session import Base


class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    # The content this comment belongs to
    content_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("contents.id", ondelete="CASCADE"), nullable=False, index=True
    )

    # The user who wrote the comment
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )

    # Self-referential FK — NULL means top-level comment; non-NULL means a reply.
    # Only one level of nesting is supported: replies cannot have replies.
    parent_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("comments.id", ondelete="CASCADE"), nullable=True, index=True
    )

    # The comment body
    body: Mapped[str] = mapped_column(Text, nullable=False)

    # Soft delete flag — set to True when a comment with existing replies is deleted.
    # The row is kept so replies don't become orphaned; body is cleared.
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, index=True)

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
    content = relationship("Content", back_populates="comments")
    author  = relationship("User", back_populates="comments")

    parent = relationship(
        "Comment",
        remote_side=[id],              # 🔑 REQUIRED
        back_populates="replies",
        foreign_keys=[parent_id],
    )

    # Self-referential: a top-level comment can have many replies
    replies = relationship(
        "Comment",
        back_populates="parent",
        cascade="all, delete-orphan",
    )