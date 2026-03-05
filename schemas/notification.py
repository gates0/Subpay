# → app/schemas/notification.py

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel


# ── Notification Type Enum ────────────────────────────────────────────────────
# Each type maps to a specific event across the platform.
# The frontend uses this to pick the right icon, colour, and destination URL.

class NotificationType(str, Enum):
    # Member-facing
    new_content            = "new_content"            # a hub you subscribe to posted content
    payment_success        = "payment_success"        # your payment went through
    payment_failed         = "payment_failed"         # your payment failed
    subscription_expiring  = "subscription_expiring"  # subscription expires in N days
    subscription_cancelled = "subscription_cancelled" # you cancelled a subscription

    # Creator-facing
    new_subscriber         = "new_subscriber"         # someone subscribed to your hub
    subscriber_cancelled   = "subscriber_cancelled"   # a subscriber cancelled
    withdrawal_update      = "withdrawal_update"      # withdrawal status changed


# ── Response Schema ───────────────────────────────────────────────────────────

class NotificationResponse(BaseModel):
    id:          int
    type:        NotificationType
    title:       str
    body:        str
    entity_type: Optional[str] = None
    entity_id:   Optional[int] = None
    is_read:     bool
    created_at:  datetime

    model_config = {"from_attributes": True}


# ── Summary for unread count badge ───────────────────────────────────────────

class NotificationCountResponse(BaseModel):
    unread_count: int