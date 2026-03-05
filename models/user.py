# → app/models/user.py

from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.session import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)

    # NULL until the user completes onboarding.
    # The UNIQUE constraint still applies — SQL treats each NULL as distinct
    # so multiple un-onboarded users never collide on this column.
    username: Mapped[str | None] = mapped_column(String, unique=True, index=True, nullable=True)

    hashed_password: Mapped[str | None] = mapped_column(String, nullable=True)  # nullable for OAuth users

    # NULL until the user picks a role in onboarding.
    role: Mapped[str | None] = mapped_column(String, index=True, nullable=True)

    # Profile fields
    full_name:  Mapped[str | None] = mapped_column(String(100), nullable=True)
    bio:        Mapped[str | None] = mapped_column(String(500), nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    # Status
    is_active:    Mapped[bool] = mapped_column(Boolean, default=True)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False)
    is_verified:  Mapped[bool] = mapped_column(Boolean, default=False)

    # False until POST /onboarding/complete is called.
    # Every protected endpoint checks this via the get_current_onboarded_user dependency.
    # Applies to ALL users — email/password and OAuth alike.
    is_onboarded: Mapped[bool] = mapped_column(Boolean, default=False, index=True)

    # Email verification
    verification_token: Mapped[str | None] = mapped_column(String, nullable=True, index=True)

    # Password reset
    reset_token:         Mapped[str | None]      = mapped_column(String,                nullable=True, index=True)
    reset_token_expires: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # OAuth
    oauth_provider: Mapped[str | None] = mapped_column(String, nullable=True)
    oauth_id:       Mapped[str | None] = mapped_column(String, nullable=True, index=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    last_login: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    hub           = relationship("Hub",          back_populates="creator",  uselist=False)
    subscriptions = relationship("Subscription", back_populates="member")
    transactions  = relationship("Transaction",  back_populates="user")
    withdrawals   = relationship("Withdrawal",   back_populates="creator")
    notifications = relationship("Notification", back_populates="user",     cascade="all, delete-orphan")