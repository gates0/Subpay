# → app/services/subscription.py

from sqlalchemy.orm import Session

from core.exceptions import (
    hub_not_found_exception,
    not_a_creator_exception,
    plan_not_found_exception,
    subscription_already_active_exception,
    subscription_not_cancellable_exception,
    subscription_not_found_exception,
    subscription_not_owned_exception,
    subscriber_not_found_exception,
    cannot_subscribe_to_own_hub_exception,
)
from crud.hub import get_hub_by_id, get_hub_by_creator_id
from crud.plan import get_active_plan_by_id
from services.notification import notify_subscription_cancelled, notify_subscriber_cancelled
from crud.subscription import (
    cancel_subscription,
    create_subscription,
    get_active_subscription,
    get_subscriber_detail,
    get_subscribers_by_hub,
    get_subscription_by_id,
    get_subscriptions_by_member,
    renew_subscription,
)
from models.subscription import Subscription
from models.user import User


# ── Subscribe to a Plan ───────────────────────────────────────────────────────

def subscribe(db: Session, current_user: User, plan_id: int) -> Subscription:
    """
    DEPRECATED for direct use — subscriptions are now created via the payment flow.
    Call POST /payments/initialize → user pays → POST /payments/verify.
    The payment service calls create_subscription() internally on success.

    This function is retained so the payment service can import create_subscription
    directly from crud.subscription without circular imports.
    """
    raise NotImplementedError(
        "Direct subscription creation is not supported. "
        "Use POST /api/v1/payments/initialize to begin the payment flow."
    )


# ── List Own Subscriptions ────────────────────────────────────────────────────

def list_my_subscriptions(db: Session, current_user: User) -> list[Subscription]:
    return get_subscriptions_by_member(db, member_id=current_user.id)


# ── Get a Single Subscription ─────────────────────────────────────────────────

def get_my_subscription(
    db: Session, current_user: User, subscription_id: int
) -> Subscription:
    subscription = get_subscription_by_id(db, subscription_id)
    if not subscription:
        raise subscription_not_found_exception
    # Ensure the subscription belongs to the requesting user
    if subscription.member_id != current_user.id:
        raise subscription_not_owned_exception
    return subscription


# ── Cancel a Subscription ─────────────────────────────────────────────────────

def cancel_my_subscription(
    db: Session, current_user: User, subscription_id: int
) -> dict:
    subscription = get_subscription_by_id(db, subscription_id)
    if not subscription:
        raise subscription_not_found_exception
    if subscription.member_id != current_user.id:
        raise subscription_not_owned_exception
    if subscription.status != "active":
        raise subscription_not_cancellable_exception

    cancel_subscription(db, subscription)

    # Notify the member their sub is cancelled
    notify_subscription_cancelled(
        db,
        user_id=subscription.member_id,
        hub_name=subscription.hub.name,
        hub_id=subscription.hub_id,
    )

    # Notify the creator they lost a subscriber
    notify_subscriber_cancelled(
        db,
        creator_id=subscription.hub.creator_id,
        subscriber_username=subscription.member.username,
        hub_id=subscription.hub_id,
    )

    return {"message": "Subscription cancelled successfully."}


# ── Renew a Subscription ──────────────────────────────────────────────────────

def renew_my_subscription(
    db: Session, current_user: User, subscription_id: int
) -> Subscription:
    subscription = get_subscription_by_id(db, subscription_id)
    if not subscription:
        raise subscription_not_found_exception
    if subscription.member_id != current_user.id:
        raise subscription_not_owned_exception

    # Payment for renewals is handled via POST /payments/initialize with the same plan_id.
    # The payment service will detect the expired subscription and renew it.
    # Keeping this function for non-payment manual renewals (e.g. admin comps).

    plan = get_active_plan_by_id(db, subscription.plan_id)
    if not plan:
        raise plan_not_found_exception

    return renew_subscription(db, subscription, plan)


# ── List Subscribers (creator only) ──────────────────────────────────────────

def list_my_hub_subscribers(db: Session, current_user: User) -> list[Subscription]:
    if current_user.role != "creator":
        raise not_a_creator_exception
    hub = get_hub_by_creator_id(db, current_user.id)
    if not hub:
        raise hub_not_found_exception
    return get_subscribers_by_hub(db, hub_id=hub.id)


# ── Get a Single Subscriber Detail (creator only) ────────────────────────────

def get_my_hub_subscriber(
    db: Session, current_user: User, subscription_id: int
) -> Subscription:
    if current_user.role != "creator":
        raise not_a_creator_exception
    hub = get_hub_by_creator_id(db, current_user.id)
    if not hub:
        raise hub_not_found_exception

    subscription = get_subscriber_detail(db, hub_id=hub.id, subscription_id=subscription_id)
    if not subscription:
        raise subscriber_not_found_exception
    return subscription