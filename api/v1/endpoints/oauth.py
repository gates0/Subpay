# → app/api/v1/oauth.py

import secrets

from fastapi import APIRouter, Depends, Query
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from config import settings
from core.exceptions import oauth_state_mismatch_exception, oauth_error_exception
from core.security import create_token_pair
from crud.user import get_or_create_oauth_user, update_last_login
from dependencies import get_db
from services.oauth import (
    build_authorization_url,
    exchange_code_for_token,
    fetch_user_info,
)

router = APIRouter(prefix="/oauth", tags=["oauth"])

# ── In-memory state store ─────────────────────────────────────────────────────
# Stores { state_token: provider } for CSRF validation.
# In production with multiple workers, swap this for a short-TTL Redis key.
_pending_states: dict[str, str] = {}


# ── STEP 1 — Redirect user to provider ───────────────────────────────────────

@router.get("/{provider}")
def oauth_login(provider: str):
    """
    Redirect the user to the OAuth provider's login page.

    Supported providers: `google`, `github`

    The frontend calls this URL directly (i.e. sets window.location.href to it)
    rather than fetching it as a JSON API call, because it needs the browser to
    follow the redirect to Google/GitHub.

    Example:
        window.location.href = "/api/v1/auth/google"
    """
    state = secrets.token_urlsafe(32)           # random CSRF token
    _pending_states[state] = provider           # store so callback can verify it

    authorization_url = build_authorization_url(provider, state)
    print(authorization_url)
    return RedirectResponse(authorization_url)


# ── STEP 2 — Handle provider callback ────────────────────────────────────────

@router.get("/{provider}/callback")
async def oauth_callback(
    provider: str,
    code:  str = Query(..., description="Authorization code from the provider"),
    state: str = Query(..., description="CSRF state token"),
    db: Session = Depends(get_db)):
    """
    Callback endpoint that the OAuth provider redirects back to.

    This URL must be registered in each provider's developer console:
      - Google: https://console.cloud.google.com → APIs & Services → Credentials
                → OAuth 2.0 Client → Authorised redirect URIs
                → Add: {OAUTH_CALLBACK_BASE_URL}/google/callback

      - GitHub: https://github.com/settings/developers → OAuth Apps
                → Authorization callback URL
                → Add: {OAUTH_CALLBACK_BASE_URL}/github/callback

    On success the user is redirected to your frontend at:
        FRONTEND_OAUTH_REDIRECT_URL?access_token=...&refresh_token=...

    The frontend reads the tokens from the URL query params and stores them
    (e.g. in localStorage) exactly as it would after a normal login.
    """

    # ── CSRF check ────────────────────────────────────────────────────────────
    expected_provider = _pending_states.pop(state, None)
    if not expected_provider or expected_provider != provider:
        raise oauth_state_mismatch_exception

    # ── Exchange code for access token ────────────────────────────────────────
    access_token = await exchange_code_for_token(provider, code)

    # ── Fetch normalised user info from provider ──────────────────────────────
    user_info = await fetch_user_info(provider, access_token)

    # ── Find or create the user in our database ───────────────────────────────
    # username and role are NOT set here — the user picks them in /onboarding/complete
    user, _ = get_or_create_oauth_user(
        db,
        provider=provider,
        oauth_id=user_info["provider_id"],
        email=user_info["email"],
        full_name=user_info.get("full_name"),
        avatar_url=user_info.get("avatar_url"),
    )

    if not user.is_active:
        raise oauth_error_exception

    update_last_login(db, user)

    # ── Issue our own JWT pair ────────────────────────────────────────────────
    tokens = create_token_pair(user.id)

    # ── Redirect to frontend with tokens ─────────────────────────────────────
    base_url = settings.FRONTEND_OAUTH_REDIRECT_URL if user.is_onboarded else settings.FRONTEND_VERIFY_REDIRECT_URL
    redirect_url = (
        f"{base_url}"
        f"?access_token={tokens['access_token']}"
        f"&refresh_token={tokens['refresh_token']}"
        f"&token_type=bearer"
    )
    return RedirectResponse(redirect_url)