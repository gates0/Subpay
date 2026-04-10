# → app/schemas/content.py

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


# ── Enums ─────────────────────────────────────────────────────────────────────

class ContentType(str, Enum):
    video = "video"
    image = "image"
    audio = "audio"
    pdf = "pdf"
    text = "text"


# ── Request Schemas ───────────────────────────────────────────────────────────

class ContentCreate(BaseModel):
    """
    Used for text content created via JSON body.
    File-based content (video/image/pdf) is handled separately
    via multipart form upload in the router.
    """
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    content_type: ContentType
    text_body: Optional[str] = Field(None, description="Required when content_type is 'text'")
    plan_ids: list[int] = Field(default_factory=list, description="Gate this content to one or more plans. Empty = all subscribers.")


class ContentUpdate(BaseModel):
    """All fields optional — only what is sent gets updated."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    text_body: Optional[str] = None
    thumbnail_url: Optional[str] = Field(None, max_length=1000)
    plan_ids: Optional[list[int]] = Field(None, description="Replace the plan gates. Pass empty list to remove all gates.")


# ── Response Schemas ──────────────────────────────────────────────────────────

class PlanGateSummary(BaseModel):
    """Minimal plan info shown on content so members know which plan unlocks it."""
    id: int
    name: str

    model_config = {"from_attributes": True}


class ContentResponse(BaseModel):
    """Full response — returned to the creator for their own content."""
    id: int
    hub_id: int
    plans: list[PlanGateSummary] = []
    title: str
    description: Optional[str] = None
    content_type: ContentType
    text_body: Optional[str] = None
    file_url: Optional[str]  = None
    thumbnail_url: Optional[str] = None
    is_published: bool
    is_pinned: bool
    view_count: int = 0
    like_count: int  = 0
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ContentPublicResponse(BaseModel):
    """
    Returned to members who have access.
    Excludes is_published/is_pinned state — those are creator concerns.
    """
    id: int
    hub_id: int
    plans: list[PlanGateSummary] = []
    title: str
    description: Optional[str]     = None
    content_type: ContentType
    text_body: Optional[str]     = None
    file_url: Optional[str]     = None
    thumbnail_url: Optional[str]     = None
    is_pinned: bool
    view_count: int  = 0
    like_count: int  = 0
    is_liked: bool = False
    created_at: datetime

    model_config = {"from_attributes": True}


class LikeToggleResponse(BaseModel):
    content_id: int
    is_liked: bool
    like_count: int
    message: str
