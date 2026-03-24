# → app/schemas/comment.py

import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


# ── Request Schemas ───────────────────────────────────────────────────────────

class CommentCreate(BaseModel):
    body: str = Field(..., min_length=1, max_length=2000)


class CommentUpdate(BaseModel):
    body: str = Field(..., min_length=1, max_length=2000)


# ── Embedded Summaries ────────────────────────────────────────────────────────

class CommentAuthorSummary(BaseModel):
    id: uuid.UUID
    username: str
    avatar_url: Optional[str] = None

    model_config = {"from_attributes": True}


# ── Response Schemas ──────────────────────────────────────────────────────────

class CommentResponse(BaseModel):
    """
    A top-level comment.
    `reply_count` lets the frontend show "3 replies" without fetching them
    upfront — replies are loaded lazily on demand.
    `is_deleted` True means the author deleted it but replies still exist;
    `body` will be None in that case.
    """
    id: int
    content_id: int
    parent_id: Optional[int]             = None
    author: Optional[CommentAuthorSummary] = None  # None when is_deleted=True
    body: Optional[str]             = None       # None when is_deleted=True
    is_deleted: bool
    reply_count: int                       = 0
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ReplyResponse(BaseModel):
    """
    A reply to a top-level comment.
    No reply_count — replies cannot be nested further.
    """
    id: int
    content_id: int
    parent_id: int
    author: Optional[CommentAuthorSummary] = None  # None when is_deleted=True
    body: Optional[str]             = None       # None when is_deleted=True
    is_deleted: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}