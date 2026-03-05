# → app/schemas/payment.py

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


# ── Enums ─────────────────────────────────────────────────────────────────────

class TransactionStatus(str, Enum):
    pending = "pending"
    success = "success"
    failed  = "failed"


class WithdrawalStatus(str, Enum):
    pending = "pending"
    processing = "processing"
    completed  = "completed"
    failed = "failed"


# ── Embedded summaries ────────────────────────────────────────────────────────

class PlanPaymentSummary(BaseModel):
    id: int
    name: str
    billing_cycle: str

    model_config = {"from_attributes": True}


class HubPaymentSummary(BaseModel):
    id: int
    name: str

    model_config = {"from_attributes": True}


# ── Request Schemas ───────────────────────────────────────────────────────────

class PaymentInitializeRequest(BaseModel):
    plan_id: int
    callback_url: Optional[str] = Field(
        None,
        description="URL Paystack redirects the user to after payment. "
                    "Defaults to the value in config if not provided.",
    )


class WebhookVerifyRequest(BaseModel):
    """Body sent by Paystack to our webhook endpoint after a charge."""
    event: str
    data: dict


class WithdrawalRequest(BaseModel):
    amount: float = Field(..., gt=0)
    bank_name: str = Field(..., min_length=2, max_length=100)
    account_number: str = Field(..., min_length=6, max_length=30)
    account_name: str = Field(..., min_length=2, max_length=100)


# ── Response Schemas ──────────────────────────────────────────────────────────

class PaymentInitializeResponse(BaseModel):
    """Returned to the client so they can redirect the user to Paystack."""
    reference: str
    checkout_url: str
    amount: float
    currency: str


class TransactionResponse(BaseModel):
    id: int
    reference: str
    amount: float
    currency: str
    status: TransactionStatus
    provider: str
    plan: PlanPaymentSummary
    hub: HubPaymentSummary
    created_at: datetime

    model_config = {"from_attributes": True}


class EarningsSummaryResponse(BaseModel):
    """Aggregated earnings for a creator's hub dashboard."""
    hub_id: int
    total_earned: float  # all time successful payments
    total_withdrawn: float  # all time completed withdrawals
    available_balance: float  # total_earned - total_withdrawn
    currency: str


class WithdrawalResponse(BaseModel):
    id: int
    amount: float
    currency: str
    status: WithdrawalStatus
    bank_name: Optional[str] = None
    account_number: Optional[str] = None
    account_name: Optional[str] = None
    note: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}