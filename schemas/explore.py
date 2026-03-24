# → app/schemas/explore.py

import uuid
from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel

from schemas.content import ContentType


# ── Enums ─────────────────────────────────────────────────────────────────────

class HubSortBy(str, Enum):
    newest  = "newest"   # order by hub.created_at desc
    popular = "popular"  # order by active subscriber count desc


# ── Embedded summaries ────────────────────────────────────────────────────────

class ExploreCreatorSummary(BaseModel):
    """Creator info embedded in a hub card."""
    id:         uuid.UUID
    username:   str
    avatar_url: Optional[str] = None

    model_config = {"from_attributes": True}


class ExploreHubSummary(BaseModel):
    """Hub info embedded in a content card."""
    id:         int
    name:       str
    avatar_url: Optional[str] = None

    model_config = {"from_attributes": True}


# ── Hub Discovery Card ────────────────────────────────────────────────────────

class HubExploreResponse(BaseModel):
    """
    Richer version of HubPublicResponse used on the explore/discovery page.
    Includes aggregated stats and the cheapest plan price so the UI can
    render a proper discovery card without extra calls.
    """
    id:               int
    name:             str
    description:      Optional[str] = None
    banner_url:       Optional[str] = None
    avatar_url:       Optional[str] = None
    creator:          ExploreCreatorSummary
    subscriber_count: int            = 0
    content_count:    int            = 0
    plan_count:       int            = 0
    starting_from:    Optional[float] = None  # lowest active plan price; None = no plans yet
    currency:         Optional[str]  = None   # currency of the cheapest plan
    created_at:       datetime

    model_config = {"from_attributes": True}


# ── Public Content Discovery Card ─────────────────────────────────────────────

class ContentExploreResponse(BaseModel):
    """
    A free/ungated published content item surfaced on the explore page.
    Only content with plan_id=NULL is shown here — gated content is not
    discoverable without a subscription.
    """
    id:            int
    title:         str
    description:   Optional[str]  = None
    content_type:  ContentType
    thumbnail_url: Optional[str]  = None
    hub:           ExploreHubSummary
    created_at:    datetime

    model_config = {"from_attributes": True}


# ── Creator Discovery Card ────────────────────────────────────────────────────

class CreatorExploreResponse(BaseModel):
    """
    A creator's public profile as shown on the explore/creators page.
    Includes their hub summary so the UI can link directly to the hub.
    """
    id:         uuid.UUID
    username:   str
    full_name:  Optional[str] = None
    bio:        Optional[str] = None
    avatar_url: Optional[str] = None
    hub:        Optional[ExploreHubSummary] = None
    created_at: datetime

    model_config = {"from_attributes": True}