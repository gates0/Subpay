# → app/api/v1/auth.py

import uuid

from fastapi import APIRouter, BackgroundTasks, Depends, Query, status
from fastapi.responses import RedirectResponse

from config import settings
from jose import JWTError
from sqlalchemy.orm import Session

from core.exceptions import (
    credentials_exception,
    email_taken_exception,
    invalid_credentials_exception,
    invalid_token_exception,
)
from core.security import (
    EMAIL_VERIFY_MAX_AGE,
    EMAIL_VERIFY_SALT,
    OAUTH_CODE_MAX_AGE,
    OAUTH_CODE_SALT,
    PASSWORD_RESET_MAX_AGE,
    PASSWORD_RESET_SALT,
    create_token_pair,
    decode_token,
    verify_signed_token,
)
from crud.user import (
    authenticate_user,
    create_user,
    get_user_by_email,
    get_user_by_id,
    reset_password,
    set_reset_token,
    set_verification_token,
    update_last_login,
    verify_user_email,
)
from dependencies import get_current_active_user, get_db
from models.user import User
from schemas.user import (
    EmailVerifyRequest,
    MessageResponse,
    PasswordResetConfirm,
    PasswordResetRequest,
    ResendVerificationRequest,
    TokenRefreshRequest,
    TokenResponse,
    UserLogin,
    UserRegister,
    UserResponse,
)
from services.email import send_password_reset_email, send_verification_email

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/google")
def google_login():
    from fastapi.responses import RedirectResponse
    return RedirectResponse("/api/v1/oauth/google")


@router.get("/github")
def github_login():
    from fastapi.responses import RedirectResponse
    return RedirectResponse("/api/v1/oauth/github")


# ── Registration ──────────────────────────────────────────────────────────────

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    data: UserRegister,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """
    Create a new account with email and password only.

    Username and role are NOT collected here — the user sets them by calling
    POST /onboarding/complete after registration. No protected endpoint is
    accessible until onboarding is complete.

    A verification email is sent in the background immediately after the
    account is created. Verification is not required to complete onboarding,
    but some endpoints may enforce it via the get_verified_user dependency.
    """
    if get_user_by_email(db, data.email):
        raise email_taken_exception

    user = create_user(db, data)

    background_tasks.add_task(
        send_verification_email, user.email, user.verification_token
    )
    return user


# ── Email Verification ────────────────────────────────────────────────────────

@router.get("/verify-email", response_model=TokenResponse)
def verify_email(token: str = Query(...), db: Session = Depends(get_db)):
    """
    Verify a user's email address using the signed token sent via email.
    Returns a JWT token pair so the frontend can log the user in immediately.
    """
    user_id = verify_signed_token(token, salt=EMAIL_VERIFY_SALT, max_age_seconds=EMAIL_VERIFY_MAX_AGE)
    if not user_id:
        raise invalid_token_exception

    user = get_user_by_id(db, uuid.UUID(user_id))
    if not user:
        raise invalid_token_exception

    if not user.is_verified:
        verify_user_email(db, user)

    tokens = create_token_pair(user.id)
    return TokenResponse(
        access_token=tokens["access_token"],
        refresh_token=tokens["refresh_token"],
        is_onboarded=user.is_onboarded,
    )


@router.post("/resend-verification", response_model=MessageResponse)
async def resend_verification(
    data: ResendVerificationRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """Resend a verification email. Always returns 200 to prevent email enumeration."""
    user = get_user_by_email(db, data.email)
    if user and not user.is_verified:
        token = set_verification_token(db, user)
        background_tasks.add_task(send_verification_email, user.email, token)
    return {"message": "If that email exists and is unverified, a new link has been sent"}


# ── Login & Token Management ──────────────────────────────────────────────────

@router.post("/login", response_model=TokenResponse)
def login(data: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate with email and password. Returns a JWT access + refresh token pair.

    The `is_onboarded` field in the response tells the frontend whether to
    redirect to the onboarding screen (false) or proceed to the main app (true).
    """
    user = authenticate_user(db, data.email, data.password)
    if not user:
        raise invalid_credentials_exception
    update_last_login(db, user)
    tokens = create_token_pair(user.id)
    return TokenResponse(
        access_token=tokens["access_token"],
        refresh_token=tokens["refresh_token"],
        is_onboarded=user.is_onboarded,
    )


@router.post("/refresh", response_model=TokenResponse)
def refresh_tokens(body: TokenRefreshRequest, db: Session = Depends(get_db)):
    """Exchange a valid refresh token for a fresh token pair."""
    try:
        payload = decode_token(body.refresh_token)
        if payload.get("type") != "refresh":
            raise credentials_exception
        user_id: str = payload.get("sub")
        if not user_id:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = get_user_by_id(db, uuid.UUID(user_id))
    if not user or not user.is_active:
        raise credentials_exception

    tokens = create_token_pair(user.id)
    return TokenResponse(
        access_token=tokens["access_token"],
        refresh_token=tokens["refresh_token"],
        is_onboarded=user.is_onboarded,
    )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(current_user: User = Depends(get_current_active_user)):
    """
    Stateless logout — instruct the client to discard both tokens.
    For server-side invalidation, add a Redis token blocklist and check it in
    the get_current_user dependency.
    """
    return


# ── Password Reset ────────────────────────────────────────────────────────────

@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(
    data: PasswordResetRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """
    Request a password reset email.
    Always returns 200 regardless of whether the email exists to prevent enumeration.
    """
    user = get_user_by_email(db, data.email)
    if user and user.is_active:
        token = set_reset_token(db, user)
        background_tasks.add_task(send_password_reset_email, user.email, token)
    return {"message": "If that email is registered, a reset link has been sent"}


@router.post("/reset-password", response_model=MessageResponse)
def do_reset_password(data: PasswordResetConfirm, db: Session = Depends(get_db)):
    """Confirm a password reset using the token sent by email."""
    user_id = verify_signed_token(
        data.token, salt=PASSWORD_RESET_SALT, max_age_seconds=PASSWORD_RESET_MAX_AGE
    )
    if not user_id:
        raise invalid_token_exception

    user = get_user_by_id(db, uuid.UUID(user_id))
    if not user or not user.is_active:
        raise invalid_token_exception

    # Extra check: ensure the token still matches what's stored
    # (prevents replay if the user already used the token once)
    if user.reset_token != data.token:
        raise invalid_token_exception

    reset_password(db, user, data.new_password)
    return {"message": "Password reset successfully"}


# ── OAuth Code Exchange ───────────────────────────────────────────────────────

@router.post("/exchange-code", response_model=TokenResponse)
def exchange_oauth_code(code: str = Query(...), db: Session = Depends(get_db)):
    """
    Exchange a short-lived OAuth code for a JWT token pair.
    The code is issued by the OAuth callback and expires in 60 seconds.
    """
    user_id = verify_signed_token(code, salt=OAUTH_CODE_SALT, max_age_seconds=OAUTH_CODE_MAX_AGE)
    if not user_id:
        raise invalid_token_exception

    user = get_user_by_id(db, uuid.UUID(user_id))
    if not user or not user.is_active:
        raise invalid_token_exception

    tokens = create_token_pair(user.id)
    return TokenResponse(
        access_token=tokens["access_token"],
        refresh_token=tokens["refresh_token"],
        is_onboarded=user.is_onboarded,
    )


# ── Current User ──────────────────────────────────────────────────────────────

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_active_user)):
    """
    Return the currently authenticated user's profile.

    Uses get_current_active_user (not get_current_onboarded_user) so this
    endpoint is reachable before onboarding is complete — the frontend needs
    it to check is_onboarded and decide where to route the user.
    """
    return current_user