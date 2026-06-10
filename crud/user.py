# → app/crud/user.py

import uuid
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from core.security import (
    EMAIL_VERIFY_SALT,
    PASSWORD_RESET_SALT,
    create_signed_token,
    hash_password,
    verify_password,
)
from models.user import User
from schemas.user import UserRegister, UserUpdateProfile


# ── Lookups ───────────────────────────────────────────────────────────────────

def get_user_by_id(db: Session, user_id: uuid.UUID) -> User | None:
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def get_user_by_username(db: Session, username: str) -> User | None:
    return db.query(User).filter(User.username == username).first()


def get_user_by_oauth(db: Session, provider: str, oauth_id: str) -> User | None:
    return db.query(User).filter(
        User.oauth_provider == provider,
        User.oauth_id == oauth_id,
    ).first()


# ── Creation ──────────────────────────────────────────────────────────────────

def create_user(db: Session, data: UserRegister) -> User:
    """
    Create a new email/password user.

    username → NULL  (set during onboarding)
    role     → NULL  (set during onboarding)
    is_onboarded → False (set to True after POST /onboarding/complete)
    """
    user = User(
        email=data.email,
        hashed_password=hash_password(data.password),
        full_name=data.full_name.title() if data.full_name else None,
        username=None,
        role=None,
        is_onboarded=False,
        is_verified=False,
    )
    db.add(user)
    db.flush()
    user.verification_token = create_signed_token(str(user.id), salt=EMAIL_VERIFY_SALT)
    db.commit()
    db.refresh(user)
    return user


def get_or_create_oauth_user(
    db: Session,
    *,
    provider: str,
    oauth_id: str,
    email: str,
    full_name: str | None = None,
    avatar_url: str | None = None,
) -> tuple["User", bool]:
    """
    Find an existing OAuth user or create a new one.
    Returns (user, created) where created=True if the user was just made.

    Three cases:
    1. User already linked this OAuth provider → return as-is
    2. User exists with same email (registered normally) → link OAuth, keep their data
    3. Brand new user → create with no username/role, needs onboarding
    """
    # Case 1: returning OAuth user
    user = get_user_by_oauth(db, provider, oauth_id)
    if user:
        return user, False

    # Case 2: email already registered — link OAuth to existing account
    user = get_user_by_email(db, email)
    if user:
        user.oauth_provider = provider
        user.oauth_id = oauth_id
        user.is_verified = True
        if not user.avatar_url and avatar_url:
            user.avatar_url = avatar_url
        if not user.full_name and full_name:
            user.full_name = full_name.title()
        db.commit()
        db.refresh(user)
        return user, False

    # Case 3: brand new user via OAuth
    # username → NULL  (chosen during onboarding)
    # role     → NULL  (chosen during onboarding)
    user = User(
        email=email,
        username=None,
        hashed_password=None,
        oauth_provider=provider,
        oauth_id=oauth_id,
        is_verified=True,   # OAuth provider already verified the email
        full_name=full_name.title() if full_name else None,
        avatar_url=avatar_url,
        role=None,
        is_onboarded=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user, True


# ── Onboarding ────────────────────────────────────────────────────────────────

def complete_onboarding(db: Session, user: User, username: str, role: str) -> User:
    """
    Called once — sets username + role and flips is_onboarded to True.
    If role is creator, the hub is created here.
    Username uniqueness must be validated by the caller before this runs.
    """
    user.username = username.lower()
    user.role = role
    user.is_onboarded = True
    db.commit()
    db.refresh(user)

    if role == "creator":
        from crud.hub import create_hub  # local import avoids circular dependency
        create_hub(db, creator_id=user.id, name=f"{username}'s Hub")

    return user


# ── Auth Updates ──────────────────────────────────────────────────────────────

def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(db, email)
    if not user or not user.hashed_password:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def update_last_login(db: Session, user: User) -> None:
    user.last_login = datetime.now(timezone.utc)
    db.commit()


def verify_user_email(db: Session, user: User) -> None:
    user.is_verified = True
    user.verification_token = None
    db.commit()


def set_verification_token(db: Session, user: User) -> str:
    token = create_signed_token(str(user.id), salt=EMAIL_VERIFY_SALT)
    user.verification_token = token
    db.commit()
    return token


def set_reset_token(db: Session, user: User) -> str:
    token = create_signed_token(str(user.id), salt=PASSWORD_RESET_SALT)
    user.reset_token = token
    db.commit()
    return token


def reset_password(db: Session, user: User, new_password: str) -> None:
    user.hashed_password = hash_password(new_password)
    user.reset_token = None
    db.commit()


# ── Profile Updates ───────────────────────────────────────────────────────────

def update_user_profile(db: Session, user: User, data: UserUpdateProfile) -> User:
    update_data = data.model_dump(exclude_unset=True)
    if "full_name" in update_data and update_data["full_name"]:
        update_data["full_name"] = update_data["full_name"].title()
    for field, value in update_data.items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user


def update_user_password(db: Session, user: User, new_hashed_password: str) -> None:
    user.hashed_password = new_hashed_password
    db.commit()


def upgrade_to_creator(db: Session, user: User) -> User:
    """Permanently upgrades a member to creator. Cannot be reversed."""
    user.role = "creator"
    db.commit()
    db.refresh(user)
    return user


def deactivate_user(db: Session, user: User) -> None:
    """Soft delete — marks account inactive instead of hard deleting."""
    user.is_active = False
    db.commit()