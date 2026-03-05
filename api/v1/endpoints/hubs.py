from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from dependencies import get_current_active_user, get_db
from models.user import User
from schemas.hub import (
    HubPrivateResponse,
    HubPublicResponse,
    HubStatsResponse,
    HubUpdate,
)
from services.hub import (
    get_hub,
    get_my_hub,
    get_my_hub_stats,
    list_hubs,
    update_my_hub,
)

router = APIRouter(prefix="/hubs", tags=["hubs"])


# ── LIST ALL PUBLIC HUBS ──────────────────────────────────────────────────────

@router.get("", response_model=list[HubPublicResponse])
def browse_hubs(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Browse all active hubs on the platform.
    Supports pagination via skip/limit query params.
    """
    return list_hubs(db, skip=skip, limit=limit)


# ──  GET OWN HUB ─────────────────────────────────────────────────────────────
# NOTE: /me routes MUST be registered before /{hub_id} — otherwise FastAPI
# will try to match the literal string "me" as a hub_id integer and return 422.

@router.get("/me", response_model=HubPrivateResponse)
def get_own_hub(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Return the full private details of the authenticated creator's hub."""
    return get_my_hub(db, current_user)


# ── UPDATE OWN HUB ────────────────────────────────────────────────────────────

@router.put("/me", response_model=HubPrivateResponse)
def update_own_hub(
    data: HubUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Update the authenticated creator's hub details.
    Only fields included in the request body will be changed.
    """
    return update_my_hub(db, current_user, data)


# ── GET OWN HUB STATS ─────────────────────────────────────────────────────────

@router.get("/me/stats", response_model=HubStatsResponse)
def get_own_hub_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Return aggregated stats for the creator's hub dashboard:
    subscriber count, content count, plan count.
    Revenue stats will be added when the payments module is built.
    """
    return get_my_hub_stats(db, current_user)


# ── GET ANY HUB BY ID (public) ────────────────────────────────────────────────

@router.get("/{hub_id}", response_model=HubPublicResponse)
def get_hub_by_id(
    hub_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Fetch the public details of any active hub by its ID."""
    return get_hub(db, hub_id)