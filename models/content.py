# → app/db/models/content.py

from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Table, Text, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.session import Base


# Association table — many-to-many between content and plans
content_plans = Table(
    "content_plans",
    Base.metadata,
    Column("content_id", Integer, ForeignKey("contents.id", ondelete="CASCADE"), primary_key=True),
    Column("plan_id", Integer, ForeignKey("plans.id", ondelete="CASCADE"), primary_key=True),
)


class Content(Base):
    __tablename__ = "contents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    # Belongs to one hub
    hub_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("hubs.id", ondelete="CASCADE"), nullable=False, index=True
    )

    # Identity
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Content type: "video" | "image" | "pdf" | "text"
    content_type: Mapped[str] = mapped_column(String(20), nullable=False, index=True)

    # For text content — body stored directly in DB
    text_body: Mapped[str | None] = mapped_column(Text, nullable=True)

    # For file-based content (video / image / pdf)
    file_url: Mapped[str | None] = mapped_column(String(1000), nullable=True)

    # Optional thumbnail for videos/PDFs
    thumbnail_url: Mapped[str | None] = mapped_column(String(1000), nullable=True)

    # State flags
    is_published: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    is_pinned: Mapped[bool] = mapped_column(Boolean, default=False)

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
    hub      = relationship("Hub",  back_populates="contents")
    plans    = relationship("Plan", secondary=content_plans, back_populates="contents")
    comments = relationship("Comment", back_populates="content", cascade="all, delete-orphan")
    saved_by = relationship("SavedContent", back_populates="content", cascade="all, delete-orphan")
    views    = relationship("ContentView", back_populates="content", cascade="all, delete-orphan")
    likes    = relationship("ContentLike", back_populates="content", cascade="all, delete-orphan")
