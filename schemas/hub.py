from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


# ── Request Schemas ───────────────────────────────────────────────────────────

class HubUpdate(BaseModel):
    """All fields optional — only what is sent gets updated."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=2000)
    banner_url: Optional[str] = Field(None, max_length=500)
    avatar_url: Optional[str] = Field(None, max_length=500)


# ── Response Schemas ──────────────────────────────────────────────────────────

class HubCreatorSummary(BaseModel):
    """Minimal creator info embedded inside hub responses."""
    id: int
    username: str
    avatar_url: Optional[str] = None

    model_config = {"from_attributes": True}


class HubPublicResponse(BaseModel):
    """Returned to anyone browsing/viewing hubs."""
    id: int
    name: str
    description: Optional[str] = None
    banner_url: Optional[str] = None
    avatar_url: Optional[str] = None
    creator: HubCreatorSummary
    created_at: datetime

    model_config = {"from_attributes": True}


class HubPrivateResponse(HubPublicResponse):
    """Returned only to the hub's own creator — includes status."""
    is_active: bool
    updated_at: datetime

    model_config = {"from_attributes": True}


class HubStatsResponse(BaseModel):
    """Aggregated stats for a creator's hub dashboard."""
    hub_id: int
    total_subscribers: int
    total_content_items: int
    total_plans: int
    # Revenue and payout info will be added when the payments module is built