# → app/schemas/subscription.py

from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


# ── Enums ─────────────────────────────────────────────────────────────────────

class SubscriptionStatus(str, Enum):
    active    = "active"
    cancelled = "cancelled"
    expired   = "expired"


# ── Embedded summaries (nested inside responses) ──────────────────────────────

class PlanSummary(BaseModel):
    id: int
    name: str
    price: float
    currency: str
    billing_cycle: str

    model_config = {"from_attributes": True}


class HubSummary(BaseModel):
    id: int
    name: str
    avatar_url: Optional[str] = None

    model_config = {"from_attributes": True}


class MemberSummary(BaseModel):
    id: UUID
    username: str
    avatar_url: Optional[str] = None

    model_config = {"from_attributes": True}


# ── Request Schemas ───────────────────────────────────────────────────────────

class SubscriptionCreate(BaseModel):
    """Body sent by a member when subscribing to a plan."""
    plan_id: int


# ── Response Schemas ──────────────────────────────────────────────────────────

class SubscriptionResponse(BaseModel):
    """Returned to the member — shows their own subscription details."""
    id: int
    status: SubscriptionStatus
    auto_renew: bool
    started_at: datetime
    expires_at: Optional[datetime] = None
    cancelled_at: Optional[datetime] = None
    created_at: datetime
    hub: HubSummary
    plan: PlanSummary

    model_config = {"from_attributes": True}


class SubscriberResponse(BaseModel):
    """Returned to the creator — shows who is subscribed to their hub."""
    id: int
    status: SubscriptionStatus
    auto_renew: bool
    started_at: datetime
    expires_at: Optional[datetime] = None
    cancelled_at: Optional[datetime] = None
    created_at: datetime
    member: MemberSummary
    plan: PlanSummary

    model_config = {"from_attributes": True}