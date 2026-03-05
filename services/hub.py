from sqlalchemy.orm import Session

from core.exceptions import (
    hub_inactive_exception,
    hub_not_found_exception,
    not_a_creator_exception,
)
from crud.hub import (
    create_hub,
    get_all_active_hubs,
    get_hub_by_creator_id,
    get_hub_by_id,
    get_hub_stats,
    update_hub,
)
from models.hub import Hub
from models.user import User
from schemas.hub import HubStatsResponse, HubUpdate


# ── List All Hubs (public) ────────────────────────────────────────────────────

def list_hubs(db: Session, skip: int = 0, limit: int = 20) -> list[Hub]:
    return get_all_active_hubs(db, skip=skip, limit=limit)


# ── Get Any Hub By ID (public) ────────────────────────────────────────────────

def get_hub(db: Session, hub_id: int) -> Hub:
    hub = get_hub_by_id(db, hub_id)
    if not hub:
        raise hub_not_found_exception
    if not hub.is_active:
        raise hub_inactive_exception
    return hub


# ── Get Own Hub (creator only) ────────────────────────────────────────────────

def get_my_hub(db: Session, current_user: User) -> Hub:
    _require_creator(current_user)
    hub = get_hub_by_creator_id(db, current_user.id)
    if not hub:
        raise hub_not_found_exception
    return hub


# ── Update Own Hub (creator only) ─────────────────────────────────────────────

def update_my_hub(db: Session, current_user: User, data: HubUpdate) -> Hub:
    _require_creator(current_user)
    hub = get_hub_by_creator_id(db, current_user.id)
    if not hub:
        raise hub_not_found_exception
    return update_hub(db, hub, data)


# ── Hub Stats (creator only) ──────────────────────────────────────────────────

def get_my_hub_stats(db: Session, current_user: User) -> HubStatsResponse:
    _require_creator(current_user)
    hub = get_hub_by_creator_id(db, current_user.id)
    if not hub:
        raise hub_not_found_exception
    stats = get_hub_stats(db, hub.id)
    return HubStatsResponse(**stats)


# ── Internal: Auto-create hub ─────────────────────────────────────────────────

def create_hub_for_user(db: Session, user: User) -> Hub:
    """
    Called internally whenever a user becomes a creator:
      - On registration if role = "creator"
      - On POST /users/me/become-creator
    The hub name defaults to the user's username and can be changed later.
    """
    return create_hub(db, creator_id=user.id, name=f"{user.username}'s Hub")


# ── Private Guard ─────────────────────────────────────────────────────────────

def _require_creator(user: User) -> None:
    if user.role != "creator":
        raise not_a_creator_exception