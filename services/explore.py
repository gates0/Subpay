# → app/services/explore.py

from typing import Optional

from sqlalchemy.orm import Session

from crud.explore import (
    get_hub_explore_stats,
    search_creators,
    search_hubs,
    search_public_content,
)
from schemas.explore import (
    ContentExploreResponse,
    CreatorExploreResponse,
    ExploreCreatorSummary,
    ExploreHubSummary,
    HubExploreResponse,
    HubSortBy,
)
from schemas.content import ContentType


# ── Hub Discovery ─────────────────────────────────────────────────────────────

def explore_hubs(
    db: Session,
    *,
    q:         Optional[str]      = None,
    min_price: Optional[float]    = None,
    max_price: Optional[float]    = None,
    sort_by:   HubSortBy          = HubSortBy.newest,
    skip:      int                = 0,
    limit:     int                = 20,
) -> list[HubExploreResponse]:
    hubs = search_hubs(
        db,
        q=q,
        min_price=min_price,
        max_price=max_price,
        sort_by=sort_by,
        skip=skip,
        limit=limit,
    )

    if not hubs:
        return []

    # Fetch all stats in 3 batched queries — never N+1
    hub_ids = [h.id for h in hubs]
    stats   = get_hub_explore_stats(db, hub_ids)

    results = []
    for hub in hubs:
        s = stats.get(hub.id, {})
        results.append(
            HubExploreResponse(
                id=hub.id,
                name=hub.name,
                description=hub.description,
                banner_url=hub.banner_url,
                avatar_url=hub.avatar_url,
                creator=ExploreCreatorSummary(
                    id=hub.creator.id,
                    username=hub.creator.username,
                    avatar_url=hub.creator.avatar_url,
                ),
                subscriber_count=s.get("subscriber_count", 0),
                content_count=s.get("content_count", 0),
                plan_count=s.get("plan_count", 0),
                starting_from=s.get("starting_from"),
                currency=s.get("currency"),
                created_at=hub.created_at,
            )
        )
    return results


# ── Public Content Discovery ──────────────────────────────────────────────────

def explore_content(
    db: Session,
    *,
    q:            Optional[str]         = None,
    content_type: Optional[ContentType] = None,
    skip:         int                   = 0,
    limit:        int                   = 20,
) -> list[ContentExploreResponse]:
    items = search_public_content(
        db,
        q=q,
        content_type=content_type.value if content_type else None,
        skip=skip,
        limit=limit,
    )

    return [
        ContentExploreResponse(
            id=item.id,
            title=item.title,
            description=item.description,
            content_type=item.content_type,
            thumbnail_url=item.thumbnail_url,
            hub=ExploreHubSummary(
                id=item.hub.id,
                name=item.hub.name,
                avatar_url=item.hub.avatar_url,
            ),
            created_at=item.created_at,
        )
        for item in items
    ]


# ── Creator Discovery ─────────────────────────────────────────────────────────

def explore_creators(
    db: Session,
    *,
    q:     Optional[str] = None,
    skip:  int           = 0,
    limit: int           = 20,
) -> list[CreatorExploreResponse]:
    creators = search_creators(db, q=q, skip=skip, limit=limit)

    return [
        CreatorExploreResponse(
            id=user.id,
            username=user.username,
            full_name=user.full_name,
            bio=user.bio,
            avatar_url=user.avatar_url,
            hub=ExploreHubSummary(
                id=user.hub.id,
                name=user.hub.name,
                avatar_url=user.hub.avatar_url,
            ) if user.hub else None,
            created_at=user.created_at,
        )
        for user in creators
    ]