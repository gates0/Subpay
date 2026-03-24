# → app/dependencies.py

import uuid

from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError
from sqlalchemy.orm import Session

from core.exceptions import (
    credentials_exception,
    inactive_user_exception,
    onboarding_required_exception,
    unverified_user_exception,
)
from core.security import decode_token
from crud.user import get_user_by_id
from db.session import SessionLocal
from models.user import User

security = HTTPBearer()


# ── Database session ──────────────────────────────────────────────────────────

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ── Dependency ladder ─────────────────────────────────────────────────────────
#
#  get_current_user                 → decodes JWT, returns User or 401
#      └── get_current_active_user  → also checks is_active; used by /auth and /onboarding
#              └── get_current_onboarded_user  → also checks is_onboarded; used by all other routers
#
# Most routers use get_current_onboarded_user.
# Only /auth/* and /onboarding/* use get_current_active_user so that
# un-onboarded users can still log in and complete their setup.


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    token = credentials.credentials
    """Decode JWT and return the matching User. Raises 401 on any failure."""
    try:
        payload = decode_token(token)
        if payload.get("type") != "access":
            raise credentials_exception
        user_id: str = payload.get("sub")
        if not user_id:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = get_user_by_id(db, uuid.UUID(user_id))
    if not user:
        raise credentials_exception
    return user


def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Extends get_current_user with an is_active check.
    Used by: /auth/*, /onboarding/*
    Does NOT check is_onboarded — intentionally allows un-onboarded users through.
    """
    if not current_user.is_active:
        raise inactive_user_exception
    return current_user


def get_current_onboarded_user(
    current_user: User = Depends(get_current_active_user),
) -> User:
    """
    The standard dependency for every protected router outside of /auth and /onboarding.
    Blocks access until the user has completed onboarding (username + role chosen).

    Routers that use this: /users, /hubs, /plans, /subscriptions,
                           /content, /payments, /notifications, /explore
    """
    if not current_user.is_onboarded:
        raise onboarding_required_exception
    return current_user


def get_verified_user(
    current_user: User = Depends(get_current_onboarded_user),
) -> User:
    """
    Optional stricter dependency for endpoints that require email verification.
    Add this to any route that should only be accessible after email is confirmed.
    """
    if not current_user.is_verified:
        raise unverified_user_exception
    return current_user