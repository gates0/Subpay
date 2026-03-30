# → app/schemas/plan.py

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, field_validator


# ── Enums ─────────────────────────────────────────────────────────────────────

class BillingCycle(str, Enum):
    monthly = "monthly"
    yearly = "yearly"
    one_time = "one_time"


class Currency(str, Enum):
    USD = "USD"
    EUR = "EUR"
    GBP = "GBP"
    NGN = "NGN"  # add more as needed


# ── Request Schemas ───────────────────────────────────────────────────────────

class PlanCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=2000)
    price: float = Field(..., gt=0, description="Must be greater than 0")
    currency: Currency = Currency.USD
    billing_cycle: BillingCycle = BillingCycle.monthly

    @field_validator("price")
    @classmethod
    def round_price(cls, v: float) -> float:
        return round(v, 2)


class PlanUpdate(BaseModel):
    """All fields optional — only what is sent gets updated."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=2000)
    price: Optional[float] = Field(None, gt=0)
    currency: Optional[Currency] = None
    billing_cycle: Optional[BillingCycle] = None

    @field_validator("price")
    @classmethod
    def round_price(cls, v: Optional[float]) -> Optional[float]:
        if v is not None:
            return round(v, 2)
        return v


# ── Response Schemas ──────────────────────────────────────────────────────────

class PlanResponse(BaseModel):
    id: int
    hub_id: int
    name: str
    description: Optional[str] = None
    price: float
    currency: str
    billing_cycle: str
    is_active: bool
    tier: Optional[int] = None  # 1 = cheapest; computed from price rank within the hub
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}