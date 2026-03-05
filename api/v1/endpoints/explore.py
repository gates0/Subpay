# → app/api/v1/explore.py

from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from dependencies import get_current_onboarded_user, get_db
from models.user import User
from schemas.content import ContentType
from schemas.explore import (
    ContentExploreResponse,
    CreatorExploreResponse,
    HubExploreResponse,
    HubSortBy,
)
from services.explore import explore_content, explore_creators, explore_hubs

router = APIRouter(prefix="/explore", tags=["explore"])


# ── DISCOVER HUBS ─────────────────────────────────────────────────────────────

@router.get("/hubs", response_model=list[HubExploreResponse])
def discover_hubs(
    q: Optional[str] = Query(
        None,
        description="Search term matched against hub name and description.",
    ),
    min_price: Optional[float] = Query(
        None,
        ge=0,
        description="Only return hubs with a plan priced at or above this value.",
    ),
    max_price: Optional[float] = Query(
        None,
        ge=0,
        description="Only return hubs with a plan priced at or below this value.",
    ),
    sort_by: HubSortBy = Query(
        HubSortBy.newest,
        description="Sort order: 'newest' (default) or 'popular' (by subscriber count).",
    ),
    skip: int = Query(0,  ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    Browse and search all active hubs on the platform.

    Each result card includes:
    - Hub identity (name, description, banner, avatar)
    - Creator summary
    - Aggregated stats (subscriber count, content count, plan count)
    - Starting price of the cheapest active plan

    **Filters:** keyword search, price range
    **Sorting:** newest (default) or most popular
    """
    return explore_hubs(
        db,
        q=q,
        min_price=min_price,
        max_price=max_price,
        sort_by=sort_by,
        skip=skip,
        limit=limit,
    )


# ── DISCOVER PUBLIC CONTENT ───────────────────────────────────────────────────

@router.get("/content", response_model=list[ContentExploreResponse])
def discover_content(
    q: Optional[str] = Query(
        None,
        description="Search term matched against content title and description.",
    ),
    content_type: Optional[ContentType] = Query(
        None,
        description="Filter by content type: 'video', 'image', 'pdf', or 'text'.",
    ),
    skip: int = Query(0,  ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    Discover free published content across all active hubs.

    Only content that is **not gated behind a plan** (`plan_id = null`) is
    returned here. Plan-gated content is only visible after subscribing to
    the relevant plan on that hub.

    Each result includes which hub the content belongs to so the UI can
    link directly to the hub's subscription page.

    **Filters:** keyword search, content type
    """
    return explore_content(
        db,
        q=q,
        content_type=content_type,
        skip=skip,
        limit=limit,
    )


# ── DISCOVER CREATORS ─────────────────────────────────────────────────────────

@router.get("/creators", response_model=list[CreatorExploreResponse])
def discover_creators(
    q: Optional[str] = Query(
        None,
        description=(
            "Search term matched against creator username, full name, "
            "or their hub name."
        ),
    ),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    Search and browse creators on the platform.

    The search term matches across the creator's username, full name,
    **and** their hub name — so a user can type a hub name and still find
    the creator behind it.

    Each result includes a hub summary so the UI can navigate directly
    to the hub without an extra request.
    """
    return explore_creators(db, q=q, skip=skip, limit=limit)