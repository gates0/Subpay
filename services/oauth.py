# → app/services/oauth.py
#
# All OAuth provider logic is isolated here.
# Adding a new provider (e.g. Twitter/X) means adding a new block here
# and nothing else needs to change.

import httpx

from config import settings
from core.exceptions import oauth_error_exception, oauth_missing_email_exception


# ── Provider configuration ────────────────────────────────────────────────────

PROVIDERS = {
    "google": {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "authorize_url": "https://accounts.google.com/o/oauth2/v2/auth",
        "token_url": "https://oauth2.googleapis.com/token",
        "userinfo_url": "https://www.googleapis.com/oauth2/v3/userinfo",
        "scope": "openid email profile",
    },
    "github": {
        "client_id": settings.GITHUB_CLIENT_ID,
        "client_secret": settings.GITHUB_CLIENT_SECRET,
        "authorize_url": "https://github.com/login/oauth/authorize",
        "token_url": "https://github.com/login/oauth/access_token",
        "userinfo_url": "https://api.github.com/user",
        "emails_url": "https://api.github.com/user/emails",  # GitHub-specific
        "scope": "read:user user:email",
    },
}


def get_provider_config(provider: str) -> dict:
    config = PROVIDERS.get(provider)
    if not config:
        from core.exceptions import oauth_provider_not_supported_exception
        raise oauth_provider_not_supported_exception
    return config


# ── Authorization URL builder ─────────────────────────────────────────────────

def build_authorization_url(provider: str, state: str) -> str:
    """
    Build the URL to redirect the user to the OAuth provider's login page.
    The state parameter is a random string used to prevent CSRF attacks.
    """
    config = get_provider_config(provider)
    callback_url = f"{settings.OAUTH_CALLBACK_BASE_URL}/api/v1/oauth/{provider}/callback"

    params = {
        "client_id": config["client_id"],
        "redirect_uri": callback_url,
        "scope": config["scope"],
        "state": state,
        "response_type": "code",
    }

    if provider == "google":
        params["access_type"] = "offline"
        params["prompt"] = "select_account"

    query_string = "&".join(f"{k}={v}" for k, v in params.items())
    return f"{config['authorize_url']}?{query_string}"


# ── Token exchange ────────────────────────────────────────────────────────────

async def exchange_code_for_token(provider: str, code: str) -> str:
    """
    Exchange the authorization code returned by the provider for an access token.
    Returns the access token string.
    """
    config = get_provider_config(provider)
    callback_url = f"{settings.OAUTH_CALLBACK_BASE_URL}/api/v1/oauth/{provider}/callback"

    payload = {
        "client_id": config["client_id"],
        "client_secret": config["client_secret"],
        "code": code,
        "redirect_uri": callback_url,
        "grant_type": "authorization_code",
    }

    headers = {"Accept": "application/json"}  # GitHub needs this to return JSON

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                config["token_url"],
                data=payload,
                headers=headers,
                timeout=10.0,
            )
            data = response.json()
        except httpx.RequestError:
            raise oauth_error_exception

    access_token = data.get("access_token")
    if not access_token:
        raise oauth_error_exception

    return access_token


# ── User info fetching ────────────────────────────────────────────────────────

async def fetch_user_info(provider: str, access_token: str) -> dict:
    """
    Use the access token to fetch the authenticated user's profile from the provider.
    Returns a normalised dict: { email, provider_id, username, avatar_url }
    so the rest of the app never needs to know which provider was used.
    """
    if provider == "google":
        return await _fetch_google_user(access_token)
    if provider == "github":
        return await _fetch_github_user(access_token)
    raise oauth_error_exception


async def _fetch_google_user(access_token: str) -> dict:
    config = PROVIDERS["google"]

    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(
                config["userinfo_url"],
                headers={"Authorization": f"Bearer {access_token}"},
                timeout=10.0,
            )
            data = resp.json()
        except httpx.RequestError:
            raise oauth_error_exception

    email = data.get("email")
    if not email:
        raise oauth_missing_email_exception

    return {
        "email":       email,
        "provider_id": data.get("sub"),   # Google's unique user ID
        "avatar_url":  data.get("picture"),
        "full_name":   data.get("name"),
    }


async def _fetch_github_user(access_token: str) -> dict:
    config  = PROVIDERS["github"]
    headers = {"Authorization": f"Bearer {access_token}"}

    async with httpx.AsyncClient() as client:
        try:
            # Fetch main profile
            user_resp = await client.get(
                config["userinfo_url"],
                headers=headers,
                timeout=10.0,
            )
            user_data = user_resp.json()

            # GitHub users can hide their email — fetch from the emails endpoint
            email = user_data.get("email")
            if not email:
                emails_resp = await client.get(
                    config["emails_url"],
                    headers=headers,
                    timeout=10.0,
                )
                emails = emails_resp.json()
                # Pick the primary verified email
                for entry in emails:
                    if entry.get("primary") and entry.get("verified"):
                        email = entry.get("email")
                        break

        except httpx.RequestError:
            raise oauth_error_exception

    if not email:
        raise oauth_missing_email_exception

    return {
        "email": email,
        "provider_id": str(user_data.get("id")),  # GitHub's unique user ID
        "avatar_url": user_data.get("avatar_url"),
        "full_name": user_data.get("name"),
    }