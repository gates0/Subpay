# → app/services/payment.py

from sqlalchemy.orm import Session

from config import settings
from core.exceptions import (
    hub_not_found_exception,
    not_a_creator_exception,
    payment_already_processed_exception,
    payment_failed_exception,
    payment_reference_not_found_exception,
    plan_not_found_exception,
    withdrawal_insufficient_balance_exception,
    cannot_subscribe_to_own_hub_exception,
    subscription_already_active_exception,
)
from crud.hub import get_hub_by_creator_id, get_hub_by_id
from crud.payment import (
    create_pending_transaction,
    create_withdrawal_request,
    get_total_earned,
    get_total_withdrawn,
    get_transaction_by_reference,
    get_transactions_by_hub,
    get_transactions_by_user,
    get_withdrawals_by_hub,
    mark_transaction_failed,
    mark_transaction_success,
)
from crud.plan import get_active_plan_by_id
from crud.subscription import create_subscription, get_active_subscription
from models.transaction import Transaction
from models.withdrawal import Withdrawal
from models.user import User
from schemas.payment import (
    EarningsSummaryResponse,
    PaymentInitializeResponse,
    WithdrawalRequest,
)
from services.paystack import (
    generate_reference,
    initialize_transaction,
    verify_transaction,
)
from services.notification import (
    notify_new_subscriber,
    notify_payment_success,
    notify_payment_failed,
)


# ── Initialize Payment ────────────────────────────────────────────────────────

async def initialize_payment(
    db: Session,
    current_user: User,
    plan_id: int,
    callback_url: str | None,
) -> PaymentInitializeResponse:
    """
    Step 1 of the payment flow.
    Validates the plan → creates a pending Transaction → calls Paystack →
    returns the checkout URL to redirect the user to.
    """
    plan = get_active_plan_by_id(db, plan_id)
    if not plan:
        raise plan_not_found_exception

    hub = get_hub_by_id(db, plan.hub_id)
    if not hub:
        raise hub_not_found_exception

    if hub.creator_id == current_user.id:
        raise cannot_subscribe_to_own_hub_exception

    existing = get_active_subscription(db, member_id=current_user.id, hub_id=hub.id)
    if existing:
        raise subscription_already_active_exception

    reference    = generate_reference()
    amount       = float(plan.price)
    currency     = plan.currency
    resolved_cb  = callback_url or settings.PAYMENT_CALLBACK_URL

    # Record the pending transaction BEFORE calling Paystack so we always
    # have a record even if the user closes the browser mid-payment.
    transaction = create_pending_transaction(
        db,
        user_id=current_user.id,
        plan_id=plan.id,
        hub_id=hub.id,
        reference=reference,
        amount=amount,
        currency=currency,
        provider="paystack",
    )

    # Call Paystack
    paystack_data = await initialize_transaction(
        email=current_user.email,
        amount_naira=amount,
        reference=reference,
        callback_url=resolved_cb,
        metadata={
            "user_id": str(current_user.id),
            "plan_id": plan.id,
            "hub_id":  hub.id,
            "transaction_id": transaction.id,
        },
    )

    return PaymentInitializeResponse(
        reference=reference,
        checkout_url=paystack_data["authorization_url"],
        amount=amount,
        currency=currency,
    )


# ── Verify Payment (webhook + manual) ────────────────────────────────────────

async def verify_payment(db: Session, reference: str) -> Transaction:
    """
    Step 2 of the payment flow. Called either by:
      - Paystack's webhook after a charge event
      - The client after being redirected back from Paystack's hosted page

    Idempotent — safe to call multiple times for the same reference.
    """
    transaction = get_transaction_by_reference(db, reference)
    if not transaction:
        raise payment_reference_not_found_exception

    # Idempotency guard — don't double-process a completed transaction
    if transaction.status == "success":
        raise payment_already_processed_exception
    if transaction.status == "failed":
        raise payment_failed_exception

    # Ask Paystack whether the payment actually went through
    paystack_data = await verify_transaction(reference)
    paystack_status = paystack_data.get("status")  # "success" | "failed" | "abandoned"

    if paystack_status != "success":
        mark_transaction_failed(db, transaction, paystack_data)
        # Fetch hub name for the notification message
        _hub = get_hub_by_id(db, transaction.hub_id)
        notify_payment_failed(
            db,
            user_id=transaction.user_id,
            hub_name=_hub.name if _hub else "the hub",
        )
        raise payment_failed_exception

    # Payment confirmed — create the subscription and link it to the transaction
    plan = get_active_plan_by_id(db, transaction.plan_id)
    if not plan:
        # Plan was deleted between init and verify — mark failed
        mark_transaction_failed(db, transaction, paystack_data)
        raise payment_failed_exception

    subscription = create_subscription(
        db,
        member_id=transaction.user_id,
        hub_id=transaction.hub_id,
        plan=plan,
    )

    mark_transaction_success(db, transaction, subscription.id, paystack_data)

    # Notify the member their payment went through
    _hub = get_hub_by_id(db, transaction.hub_id)
    notify_payment_success(
        db,
        user_id=transaction.user_id,
        hub_name=_hub.name,
        hub_id=_hub.id,
    )

    # Notify the creator they have a new subscriber
    notify_new_subscriber(
        db,
        creator_id=_hub.creator_id,
        subscriber_username=subscription.member.username,
        hub_id=_hub.id,
    )

    return transaction


# ── Payment History (member's own) ────────────────────────────────────────────

def get_my_payment_history(db: Session, current_user: User) -> list[Transaction]:
    return get_transactions_by_user(db, user_id=current_user.id)


# ── Creator: Earnings Summary ─────────────────────────────────────────────────

def get_my_earnings(db: Session, current_user: User) -> EarningsSummaryResponse:
    if current_user.role != "creator":
        raise not_a_creator_exception

    hub = get_hub_by_creator_id(db, current_user.id)
    if not hub:
        raise hub_not_found_exception

    total_earned    = get_total_earned(db, hub.id)
    total_withdrawn = get_total_withdrawn(db, hub.id)

    return EarningsSummaryResponse(
        hub_id=hub.id,
        total_earned=total_earned,
        total_withdrawn=total_withdrawn,
        available_balance=round(total_earned - total_withdrawn, 2),
        currency=hub.plans[0].currency if hub.plans else "NGN",
    )


# ── Creator: Hub Transactions ─────────────────────────────────────────────────

def get_my_hub_transactions(db: Session, current_user: User) -> list[Transaction]:
    if current_user.role != "creator":
        raise not_a_creator_exception

    hub = get_hub_by_creator_id(db, current_user.id)
    if not hub:
        raise hub_not_found_exception

    return get_transactions_by_hub(db, hub_id=hub.id)


# ── Creator: Withdrawal Request ───────────────────────────────────────────────

def request_withdrawal(
    db: Session, current_user: User, data: WithdrawalRequest
) -> Withdrawal:
    if current_user.role != "creator":
        raise not_a_creator_exception

    hub = get_hub_by_creator_id(db, current_user.id)
    if not hub:
        raise hub_not_found_exception

    # Guard: cannot withdraw more than the available balance
    total_earned    = get_total_earned(db, hub.id)
    total_withdrawn = get_total_withdrawn(db, hub.id)
    available       = total_earned - total_withdrawn

    if data.amount > available:
        raise withdrawal_insufficient_balance_exception

    currency = hub.plans[0].currency if hub.plans else "NGN"

    return create_withdrawal_request(
        db,
        creator_id=current_user.id,
        hub_id=hub.id,
        amount=data.amount,
        currency=currency,
        bank_name=data.bank_name,
        account_number=data.account_number,
        account_name=data.account_name,
    )