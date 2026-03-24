# → app/services/onboarding.py

from sqlalchemy.orm import Session

from core.exceptions import (
    onboarding_already_complete_exception,
    onboarding_username_taken_exception,
    unverified_user_exception,
)
from crud.user import complete_onboarding, get_user_by_username
from models.user import User
from schemas.user import OnboardingComplete, OnboardingStatusResponse, UsernameCheckResponse


def get_onboarding_status(current_user: User) -> OnboardingStatusResponse:
    return OnboardingStatusResponse(
        is_onboarded=current_user.is_onboarded,
        email=current_user.email,
    )


def check_username_availability(db: Session, username: str) -> UsernameCheckResponse:
    """
    Case-insensitive uniqueness check.
    Returns immediately — no auth required so the frontend can check
    while the user is still typing.
    """
    normalised = username.lower()
    taken = get_user_by_username(db, normalised) is not None
    return UsernameCheckResponse(username=normalised, available=not taken)


def complete_user_onboarding(
    db: Session, current_user: User, data: OnboardingComplete
) -> User:
    # Guard: email must be verified first
    if not current_user.is_verified:
        raise unverified_user_exception

    # Guard: cannot complete twice
    if current_user.is_onboarded:
        raise onboarding_already_complete_exception

    # Enforce uniqueness (case-insensitive — username validator lowercases it)
    existing = get_user_by_username(db, data.username.lower())
    if existing and existing.id != current_user.id:
        raise onboarding_username_taken_exception

    return complete_onboarding(
        db,
        user=current_user,
        username=data.username,
        role=data.role,
        full_name=data.full_name,
    )