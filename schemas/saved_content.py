# → app/schemas/saved_content.py

from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from schemas.content import ContentType


# ── Embedded summaries ────────────────────────────────────────────────────────

class SavedHubSummary(BaseModel):
    id: int
    name: str
    avatar_url: Optional[str] = None

    model_config = {"from_attributes": True}


class SavedContentDetail(BaseModel):
    """The content item itself, embedded inside a saved bookmark response."""
    id: int
    title: str
    description: Optional[str]  = None
    content_type: ContentType
    thumbnail_url: Optional[str]  = None
    hub: SavedHubSummary
    created_at: datetime       # when the content was published

    model_config = {"from_attributes": True}


# ── Response Schemas ──────────────────────────────────────────────────────────

class SavedContentResponse(BaseModel):
    """A single bookmark entry in the user's saved list."""
    id: int              # SavedContent row ID
    content: SavedContentDetail
    saved_at: datetime         # when the user saved it

    model_config = {"from_attributes": True}


class ToggleSaveResponse(BaseModel):
    """Returned by POST /content/{content_id}/save to confirm the new state."""
    content_id: int
    is_saved: bool             # True = just saved, False = just unsaved
    message: str