# → app/api/v1/onboarding.py

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from dependencies import get_current_active_user, get_db
from models.user import User
from schemas.user import (
    OnboardingComplete,
    OnboardingStatusResponse,
    UserResponse,
    UsernameCheckResponse,
)
from services.onboarding import (
    check_username_availability,
    complete_user_onboarding,
    get_onboarding_status,
)

router = APIRouter(prefix="/onboarding", tags=["onboarding"])


# ── CHECK ONBOARDING STATUS ───────────────────────────────────────────────────

@router.get("/status", response_model=OnboardingStatusResponse)
def onboarding_status(
    current_user: User = Depends(get_current_active_user),
):
    """
    Returns whether the current user has completed onboarding.

    The frontend should call this immediately after login/registration.
    If `is_onboarded` is False, redirect to the onboarding screen.
    If True, proceed to the main app.

    This endpoint intentionally uses `get_current_active_user` (not the
    stricter `get_current_onboarded_user`) so un-onboarded users can reach it.
    """
    return get_onboarding_status(current_user)


# ── CHECK USERNAME AVAILABILITY ───────────────────────────────────────────────

@router.get("/check-username", response_model=UsernameCheckResponse)
def check_username(
    username: str = Query(..., min_length=3, max_length=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Check whether a username is available before submitting the onboarding form.

    - Case-insensitive: "Ada" and "ada" are treated as the same username.
    - Safe to call repeatedly as the user types (lightweight DB lookup).
    - Returns `available: true` if the username is free, `false` if taken.
    """
    return check_username_availability(db, username)


# ── COMPLETE ONBOARDING ───────────────────────────────────────────────────────

@router.post("/complete", response_model=UserResponse)
def complete_onboarding(
    data: OnboardingComplete,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Complete onboarding for any new user — email/password or OAuth.

    **Requires a verified email address.** Call POST /auth/resend-verification
    if the user hasn't confirmed their email yet — this endpoint will return
    403 until they do.

    **Required fields:**
    - `username` — 3–50 characters, letters/numbers/hyphens/underscores only.
      Must be unique across the platform. Stored in lowercase.
    - `role` — `"member"` or `"creator"`.
      Choosing `"creator"` automatically creates a hub for the user.
      This choice is permanent (members can later upgrade via
      `POST /users/me/become-creator` but creators cannot go back).

    **Can only be called once.** Subsequent calls return 409.

    After a successful call, all protected endpoints become accessible
    and the returned `UserResponse` will show `is_onboarded: true`.
    """
    updated_user = complete_user_onboarding(db, current_user, data)
    return updated_user