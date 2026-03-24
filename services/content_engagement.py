# → app/services/content_engagement.py

from sqlalchemy.orm import Session

from core.exceptions import (
    content_not_found_exception,
    content_access_denied_exception,
    hub_not_found_exception,
    subscription_not_found_exception,
)
from crud.content import get_content_by_id
from crud.content_engagement import (
    add_like,
    get_like_count,
    get_like_entry,
    remove_like,
)
from crud.hub import get_hub_by_id
from crud.subscription import get_active_subscription
from models.user import User
from schemas.content import LikeToggleResponse


def toggle_like(db: Session, user: User, content_id: int) -> LikeToggleResponse:
    """
    Like the content if not yet liked; unlike it if already liked.
    Applies the same access gate as viewing the content.
    """
    # ── Access gate ───────────────────────────────────────────────────────────
    content = get_content_by_id(db, content_id)
    if not content or not content.is_published:
        raise content_not_found_exception

    hub = get_hub_by_id(db, content.hub_id)
    if not hub or not hub.is_active:
        raise hub_not_found_exception

    # Hub creator can like their own content
    if not (user.role == "creator" and hub.creator_id == user.id):
        subscription = get_active_subscription(db, member_id=user.id, hub_id=hub.id)
        if not subscription:
            raise subscription_not_found_exception
        if content.plan_id is not None and content.plan_id != subscription.plan_id:
            raise content_access_denied_exception

    # ── Toggle ────────────────────────────────────────────────────────────────
    existing = get_like_entry(db, user_id=user.id, content_id=content_id)

    if existing:
        remove_like(db, existing)
        new_count = get_like_count(db, content_id)
        return LikeToggleResponse(
            content_id=content_id,
            is_liked=False,
            like_count=new_count,
            message="Like removed.",
        )
    else:
        add_like(db, user_id=user.id, content_id=content_id)
        new_count = get_like_count(db, content_id)
        return LikeToggleResponse(
            content_id=content_id,
            is_liked=True,
            like_count=new_count,
            message="Content liked.",
        )