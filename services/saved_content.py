# → app/services/saved_content.py

from sqlalchemy.orm import Session

from core.exceptions import content_not_found_exception
from crud.content import get_published_content_by_id
from crud.hub import get_hub_by_id
from crud.saved_content import (
    get_saved_contents_by_user,
    get_saved_entry,
    save_content,
    unsave_content,
)
from crud.subscription import get_active_subscription
from models.user import User
from schemas.saved_content import (
    SavedContentDetail,
    SavedContentResponse,
    SavedHubSummary,
    ToggleSaveResponse,
)


# ── Access helper ─────────────────────────────────────────────────────────────

def _assert_content_access(db: Session, user: User, content_id: int):
    """
    Verify the user can access this content before allowing them to save it.
    Mirrors the same gate used by comments and content reads:
      - Hub creator → always allowed on their own hub
      - Everyone else → needs an active subscription covering the content
    """
    from core.exceptions import (
        hub_not_found_exception,
        subscription_not_found_exception,
        content_access_denied_exception,
    )

    # We need to find the hub from the content
    from crud.content import get_content_by_id
    content = get_content_by_id(db, content_id)
    if not content or not content.is_published:
        raise content_not_found_exception

    hub = get_hub_by_id(db, content.hub_id)
    if not hub or not hub.is_active:
        raise hub_not_found_exception

    # Hub creator always has access
    if user.role == "creator" and hub.creator_id == user.id:
        return content

    # Everyone else needs an active subscription
    subscription = get_active_subscription(db, member_id=user.id, hub_id=hub.id)
    if not subscription:
        raise subscription_not_found_exception

    # Check plan gate
    if content.plan_id is not None and content.plan_id != subscription.plan_id:
        raise content_access_denied_exception

    return content


# ── Toggle save/unsave ────────────────────────────────────────────────────────

def toggle_save(db: Session, user: User, content_id: int) -> ToggleSaveResponse:
    """
    Save the content if it isn't saved yet; unsave it if it already is.
    Access is checked before either action — you must be able to read the
    content to bookmark it.
    """
    _assert_content_access(db, user, content_id)

    existing = get_saved_entry(db, user_id=user.id, content_id=content_id)

    if existing:
        unsave_content(db, existing)
        return ToggleSaveResponse(
            content_id=content_id,
            is_saved=False,
            message="Content removed from your saved items.",
        )
    else:
        save_content(db, user_id=user.id, content_id=content_id)
        return ToggleSaveResponse(
            content_id=content_id,
            is_saved=True,
            message="Content saved successfully.",
        )


# ── List saved content ────────────────────────────────────────────────────────

def list_saved_content(
    db: Session, user: User, skip: int = 0, limit: int = 20
) -> list[SavedContentResponse]:
    entries = get_saved_contents_by_user(db, user_id=user.id, skip=skip, limit=limit)

    results = []
    for entry in entries:
        c = entry.content
        results.append(
            SavedContentResponse(
                id=entry.id,
                content=SavedContentDetail(
                    id=c.id,
                    title=c.title,
                    description=c.description,
                    content_type=c.content_type,
                    thumbnail_url=c.thumbnail_url,
                    hub=SavedHubSummary(
                        id=c.hub.id,
                        name=c.hub.name,
                        avatar_url=c.hub.avatar_url,
                    ),
                    created_at=c.created_at,
                ),
                saved_at=entry.saved_at,
            )
        )
    return results