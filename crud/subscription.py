# → app/crud/subscription.py

from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session, joinedload

from models.subscription import Subscription
from models.plan import Plan


# ── Lookups ───────────────────────────────────────────────────────────────────

def get_subscription_by_id(db: Session, subscription_id: int) -> Subscription | None:
    return (
        db.query(Subscription)
        .options(
            joinedload(Subscription.hub),
            joinedload(Subscription.plan),
            joinedload(Subscription.member),
        )
        .filter(Subscription.id == subscription_id)
        .first()
    )


def get_subscriptions_by_member(db: Session, member_id: int) -> list[Subscription]:
    return (
        db.query(Subscription)
        .options(
            joinedload(Subscription.hub),
            joinedload(Subscription.plan),
        )
        .filter(Subscription.member_id == member_id)
        .order_by(Subscription.created_at.desc())
        .all()
    )


def get_subscribers_by_hub(db: Session, hub_id: int) -> list[Subscription]:
    return (
        db.query(Subscription)
        .options(
            joinedload(Subscription.member),
            joinedload(Subscription.plan),
        )
        .filter(Subscription.hub_id == hub_id)
        .order_by(Subscription.created_at.desc())
        .all()
    )


def get_active_subscription(
    db: Session, member_id: int, hub_id: int
) -> Subscription | None:
    """Check if a member already has an active subscription to a hub."""
    return (
        db.query(Subscription)
        .filter(
            Subscription.member_id == member_id,
            Subscription.hub_id == hub_id,
            Subscription.status == "active",
        )
        .first()
    )


def get_subscriber_detail(
    db: Session, hub_id: int, subscription_id: int
) -> Subscription | None:
    """Get a single subscriber record scoped to a specific hub."""
    return (
        db.query(Subscription)
        .options(
            joinedload(Subscription.member),
            joinedload(Subscription.plan),
        )
        .filter(
            Subscription.id == subscription_id,
            Subscription.hub_id == hub_id,
        )
        .first()
    )


# ── Creation ──────────────────────────────────────────────────────────────────

def create_subscription(
    db: Session, member_id: int, hub_id: int, plan: Plan
) -> Subscription:
    """
    Create a new subscription. Calculates expiry based on billing cycle.
    Payment is handled separately — this just records the subscription.
    """
    expires_at = _calculate_expiry(plan.billing_cycle)

    subscription = Subscription(
        member_id=member_id,
        hub_id=hub_id,
        plan_id=plan.id,
        status="active",
        expires_at=expires_at,
    )
    db.add(subscription)
    db.commit()
    db.refresh(subscription)
    return subscription


# ── Updates ───────────────────────────────────────────────────────────────────

def cancel_subscription(db: Session, subscription: Subscription) -> Subscription:
    subscription.status = "cancelled"
    subscription.auto_renew = False
    subscription.cancelled_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(subscription)
    return subscription


def renew_subscription(db: Session, subscription: Subscription, plan: Plan) -> Subscription:
    """Extend the expiry window by one billing cycle from now."""
    subscription.status = "active"
    subscription.expires_at = _calculate_expiry(plan.billing_cycle)
    subscription.cancelled_at = None
    db.commit()
    db.refresh(subscription)
    return subscription


# ── Helpers ───────────────────────────────────────────────────────────────────

def _calculate_expiry(billing_cycle: str) -> datetime | None:
    now = datetime.now(timezone.utc)
    if billing_cycle == "monthly":
        return now + timedelta(days=30)
    if billing_cycle == "yearly":
        return now + timedelta(days=365)
    # one_time plans do not expire
    return None