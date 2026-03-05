# → app/api/v1/subscriptions.py

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from dependencies import get_current_onboarded_user, get_db
from models.user import User
from schemas.subscription import SubscriberResponse, SubscriptionCreate, SubscriptionResponse
from schemas.user import MessageResponse
from services.subscription import (
    cancel_my_subscription,
    get_my_hub_subscriber,
    get_my_subscription,
    list_my_hub_subscribers,
    list_my_subscriptions,
    renew_my_subscription,
    subscribe,
)

router = APIRouter(tags=["subscriptions"])


# ── SUBSCRIBE TO A PLAN ───────────────────────────────────────────────────────

@router.post(
    "/subscriptions",
    response_model=SubscriptionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_subscription(
    data: SubscriptionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    Subscribe to a plan on any hub.
    The plan_id determines both which hub and which tier is being subscribed to.
    A member can only have one active subscription per hub at a time.
    Creators cannot subscribe to their own hub.
    """
    return subscribe(db, current_user, data.plan_id)


# ── LIST OWN SUBSCRIPTIONS ────────────────────────────────────────────────────

@router.get("/subscriptions/me", response_model=list[SubscriptionResponse])
def get_my_subscriptions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """List all subscriptions (active, cancelled, expired) for the current user."""
    return list_my_subscriptions(db, current_user)


# ── GET A SINGLE SUBSCRIPTION ─────────────────────────────────────────────────
# NOTE: /me routes registered before /{subscription_id} — same reason as hubs

@router.get("/subscriptions/me/{subscription_id}", response_model=SubscriptionResponse)
def get_subscription(
    subscription_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """Get the full details of one of the current user's subscriptions."""
    return get_my_subscription(db, current_user, subscription_id)


# ── CANCEL A SUBSCRIPTION ─────────────────────────────────────────────────────

@router.delete(
    "/subscriptions/me/{subscription_id}",
    response_model=MessageResponse,
    status_code=status.HTTP_200_OK,
)
def cancel_subscription(
    subscription_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    Cancel an active subscription.
    Only active subscriptions can be cancelled.
    Already cancelled or expired subscriptions will return 409.
    """
    return cancel_my_subscription(db, current_user, subscription_id)


# ── RENEW A SUBSCRIPTION ──────────────────────────────────────────────────────

@router.post(
    "/subscriptions/me/{subscription_id}/renew",
    response_model=SubscriptionResponse,
)
def renew_subscription(
    subscription_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    Manually renew a subscription, extending its expiry by one billing cycle.
    Works on both active and expired subscriptions.
    Payment will be charged here once the payments module is integrated.
    """
    return renew_my_subscription(db, current_user, subscription_id)


# ── LIST HUB SUBSCRIBERS (creator only) ──────────────────────────────────────

@router.get("/hubs/me/subscribers", response_model=list[SubscriberResponse])
def get_hub_subscribers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    List all subscribers to the authenticated creator's hub.
    Includes member details and which plan each subscriber is on.
    """
    return list_my_hub_subscribers(db, current_user)


# ── GET A SINGLE SUBSCRIBER DETAIL (creator only) ────────────────────────────

@router.get("/hubs/me/subscribers/{subscription_id}", response_model=SubscriberResponse)
def get_hub_subscriber(
    subscription_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    Get the full details of a single subscriber on the creator's hub.
    Uses the subscription ID, not the member's user ID.
    """
    return get_my_hub_subscriber(db, current_user, subscription_id)