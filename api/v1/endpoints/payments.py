# → app/api/v1/payments.py

from fastapi import APIRouter, Depends, Header, HTTPException, Query, Request, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from dependencies import get_current_onboarded_user, get_db
from models.user import User
from schemas.payment import (
    EarningsSummaryResponse,
    PaymentInitializeRequest,
    PaymentInitializeResponse,
    TransactionResponse,
    WithdrawalRequest,
    WithdrawalResponse,
)
from config import settings
from services.payment import (
    get_my_earnings,
    get_my_hub_transactions,
    get_my_payment_history,
    initialize_payment,
    request_withdrawal,
    verify_payment,
)
from services.paystack import verify_webhook_signature

router = APIRouter(prefix="/payments", tags=["payments"])


# ── INITIALIZE PAYMENT ────────────────────────────────────────────────────────

@router.post(
    "/initialize",
    response_model=PaymentInitializeResponse,
    status_code=status.HTTP_201_CREATED,
)
async def initialize(
    data: PaymentInitializeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    Begin the payment flow for a subscription plan.

    Returns a `checkout_url` — redirect the user to this URL to complete
    payment on Paystack's hosted page.

    A pending transaction is recorded immediately so no payment is ever lost,
    even if the user closes the browser mid-flow.
    """
    return await initialize_payment(
        db,
        current_user,
        plan_id=data.plan_id,
        callback_url=data.callback_url,
    )


# ── PAYSTACK REDIRECT CALLBACK (browser redirect after payment) ───────────────

@router.get("/callback")
async def payment_callback(
    reference: str = Query(..., alias="reference"),
    db: Session = Depends(get_db),
):
    """
    Paystack redirects the user's browser here after payment.
    We verify the payment then redirect to the appropriate frontend page.

    Set PAYMENT_CALLBACK_URL=https://yourdomain.com/api/v1/payments/callback
    in your environment variables.
    """
    try:
        await verify_payment(db, reference)
        return RedirectResponse(
            url=f"{settings.FRONTEND_PAYMENT_SUCCESS_URL}?reference={reference}",
            status_code=status.HTTP_302_FOUND,
        )
    except HTTPException:
        return RedirectResponse(
            url=f"{settings.FRONTEND_PAYMENT_FAILURE_URL}?reference={reference}",
            status_code=status.HTTP_302_FOUND,
        )


# ── VERIFY PAYMENT (manual / client-side fallback) ────────────────────────────

@router.post("/verify", response_model=TransactionResponse)
async def verify(
    reference: str,
    db: Session = Depends(get_db),
):
    """
    Manually verify a payment by reference. Useful as a fallback if the
    automatic callback redirect was missed.
    Idempotent — safe to call more than once for the same reference.
    """
    return await verify_payment(db, reference)


# ── WEBHOOK (server-to-server from Paystack) ──────────────────────────────────

@router.post("/webhook", status_code=status.HTTP_200_OK)
async def paystack_webhook(
    request: Request,
    db: Session = Depends(get_db),
    x_paystack_signature: str = Header(..., alias="x-paystack-signature"),
):
    """
    Paystack webhook endpoint.

    Configure this URL in your Paystack dashboard:
        https://yourdomain.com/api/v1/payments/webhook

    Paystack will POST here for every charge event. We verify the HMAC
    signature before processing anything — unsigned requests are rejected with 401.

    This endpoint does NOT require user authentication since it is called
    by Paystack's servers, not your users.
    """
    raw_body = await request.body()

    if not verify_webhook_signature(raw_body, x_paystack_signature):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid webhook signature",
        )

    payload = await request.json()
    event   = payload.get("event", "")

    # Only process successful charge events
    if event == "charge.success":
        reference = payload.get("data", {}).get("reference")
        if reference:
            try:
                await verify_payment(db, reference)
            except HTTPException:
                # Already processed or failed — swallow and return 200
                # Paystack retries if we return non-200, which we don't want
                pass

    # Always return 200 to Paystack so they don't retry
    return {"status": "ok"}


# ── MY PAYMENT HISTORY ────────────────────────────────────────────────────────

@router.get("/me/history", response_model=list[TransactionResponse])
def payment_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    List all payment transactions for the authenticated user — both
    successful and failed — ordered newest first.
    """
    return get_my_payment_history(db, current_user)


# ── CREATOR: EARNINGS SUMMARY ─────────────────────────────────────────────────

@router.get("/hubs/me/earnings", response_model=EarningsSummaryResponse)
def hub_earnings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    Return the earnings summary for the creator's hub:
    total earned, total withdrawn, and available balance.
    """
    return get_my_earnings(db, current_user)


# ── CREATOR: HUB TRANSACTION LIST ─────────────────────────────────────────────

@router.get("/hubs/me/transactions", response_model=list[TransactionResponse])
def hub_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    List all transactions on the creator's hub — useful for the
    revenue dashboard. Includes both successful and failed payments.
    """
    return get_my_hub_transactions(db, current_user)


# ── CREATOR: REQUEST WITHDRAWAL ───────────────────────────────────────────────

@router.post("/withdraw", response_model=WithdrawalResponse, status_code=status.HTTP_201_CREATED)
def withdraw(
    data: WithdrawalRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    Request a payout of your available hub balance.

    The withdrawal is created with status `pending` and processed manually
    (or via a scheduled job) by the platform. The requested amount must not
    exceed your available balance (total earned minus total withdrawn).
    """
    return request_withdrawal(db, current_user, data)