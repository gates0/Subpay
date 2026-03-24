# → app/schemas/user.py

import uuid
from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, field_validator


# ── Role Enum ─────────────────────────────────────────────────────────────────

class UserRole(str, Enum):
    member  = "member"
    creator = "creator"


# ── Registration & Login ──────────────────────────────────────────────────────

class UserRegister(BaseModel):
    """
    Email + password only.
    Username and role are collected separately in POST /onboarding/complete.
    """
    email:    EmailStr
    password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
    email:    EmailStr
    password: str


# ── Tokens ────────────────────────────────────────────────────────────────────

class TokenResponse(BaseModel):
    access_token:  str
    refresh_token: str
    token_type:    str  = "bearer"
    # Frontend must show the onboarding screen when this is False.
    is_onboarded:  bool = False


class TokenRefreshRequest(BaseModel):
    refresh_token: str


# ── Email Verification ────────────────────────────────────────────────────────

class EmailVerifyRequest(BaseModel):
    token: str


class ResendVerificationRequest(BaseModel):
    email: EmailStr


# ── Password Reset ────────────────────────────────────────────────────────────

class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)


# ── Onboarding ────────────────────────────────────────────────────────────────

class OnboardingComplete(BaseModel):
    """
    Sent once by every new user — email/password or OAuth — after registration.
    Both fields are required. This call is permanent: once completed the user
    cannot change their role (except via POST /users/me/become-creator for
    the member → creator upgrade path).
    """
    username: str = Field(..., min_length=3, max_length=50)
    full_name: Optional[str] = Field(None, min_length=1, max_length=100)
    role: UserRole

    @field_validator("username")
    @classmethod
    def username_valid(cls, v: str) -> str:
        if not v.replace("_", "").replace("-", "").isalnum():
            raise ValueError(
                "Username may only contain letters, numbers, hyphens, and underscores."
            )
        return v.lower()  # store lowercase — prevents "Ada" vs "ada" conflicts


class UsernameCheckResponse(BaseModel):
    username: str
    available: bool


class OnboardingStatusResponse(BaseModel):
    is_onboarded: bool
    email: str


# ── Profile Update ────────────────────────────────────────────────────────────

class UserUpdateProfile(BaseModel):
    """All fields optional — only the ones sent will be updated."""
    full_name: Optional[str] = Field(None, min_length=1, max_length=100)
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    bio: Optional[str] = Field(None, max_length=500)
    avatar_url: Optional[str] = Field(None, max_length=500)

    @field_validator("username")
    @classmethod
    def username_valid(cls, v: Optional[str]) -> Optional[str]:
        if v and not v.replace("_", "").replace("-", "").isalnum():
            raise ValueError(
                "Username may only contain letters, numbers, hyphens, and underscores."
            )
        return v.lower() if v else v


class UserChangePassword(BaseModel):
    current_password: str = Field(..., min_length=6)
    new_password: str = Field(..., min_length=8)
    confirm_password: str = Field(..., min_length=8)

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v: str, info) -> str:
        if "new_password" in info.data and v != info.data["new_password"]:
            raise ValueError("New password and confirmation do not match.")
        return v


# ── Responses ─────────────────────────────────────────────────────────────────

class UserResponse(BaseModel):
    """Full profile — returned to the authenticated user themselves."""
    id: uuid.UUID
    email: EmailStr
    username: Optional[str]     = None   # None until onboarding complete
    role: Optional[UserRole] = None  # None until onboarding complete
    full_name: Optional[str]     = None
    bio: Optional[str]     = None
    avatar_url: Optional[str]     = None
    is_active: bool
    is_verified: bool
    is_onboarded: bool
    oauth_provider: Optional[str]  = None
    created_at: datetime

    model_config = {"from_attributes": True}


class UserPublicResponse(BaseModel):
    """Public profile — safe to return to anyone."""
    id: uuid.UUID
    username: str
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    role: UserRole
    created_at: datetime

    model_config = {"from_attributes": True}


class MessageResponse(BaseModel):
    message: str


class BecomeCreatorResponse(BaseModel):
    message: str
    role: UserRole

    model_config = {"from_attributes": True}