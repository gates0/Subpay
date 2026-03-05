import secrets
from datetime import datetime, timedelta, timezone
from typing import Literal

from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer
from jose import JWTError, jwt
from passlib.context import CryptContext

from config import settings

pwd_context = CryptContext(schemes=["bcrypt_sha256"], deprecated="auto")
_serializer = URLSafeTimedSerializer(settings.SECRET_KEY)


# ── Password ──────────────────────────────────────────────────────────────────

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


# ── JWT (access + refresh) ────────────────────────────────────────────────────

def _create_token(
    subject: str | int,
    token_type: Literal["access", "refresh"],
    expires_delta: timedelta,
) -> str:
    expire = datetime.now(timezone.utc) + expires_delta
    payload = {
        "sub": str(subject),
        "type": token_type,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_access_token(user_id: int) -> str:
    return _create_token(
        subject=user_id,
        token_type="access",
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )


def create_refresh_token(user_id: int) -> str:
    return _create_token(
        subject=user_id,
        token_type="refresh",
        expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )


def decode_token(token: str) -> dict:
    """Decode and validate a JWT. Raises JWTError on failure."""
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])


def create_token_pair(user_id: int) -> dict:
    return {
        "access_token": create_access_token(user_id),
        "refresh_token": create_refresh_token(user_id),
    }


# ── Signed tokens (email verification + password reset) ──────────────────────

def create_signed_token(data: str, salt: str) -> str:
    """
    Create a URL-safe signed token using itsdangerous.
    The token encodes `data` and can be validated/expired later.
    """
    return _serializer.dumps(data, salt=salt)


def verify_signed_token(token: str, salt: str, max_age_seconds: int) -> str | None:
    """
    Decode a signed token. Returns the original data string or None if invalid/expired.
    """
    try:
        return _serializer.loads(token, salt=salt, max_age=max_age_seconds)
    except (SignatureExpired, BadSignature):
        return None


# Salts namespace the token purpose so a verification token can't be used as a reset token
EMAIL_VERIFY_SALT = "email-verification"
PASSWORD_RESET_SALT = "password-reset"

EMAIL_VERIFY_MAX_AGE = 60 * 60 * 24        # 24 hours
PASSWORD_RESET_MAX_AGE = 60 * 60           # 1 hour