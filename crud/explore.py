# → app/crud/explore.py
#
# All search/discovery queries are kept here, separate from the operational
# CRUD files, so they can grow independently (e.g. swap ilike for full-text
# search later) without touching the rest of the codebase.

from typing import Optional

from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload

from models.content import Content
from models.hub import Hub
from models.plan import Plan
from models.subscription import Subscription
from models.user import User


# ── Hub Search ────────────────────────────────────────────────────────────────

def search_hubs(
    db: Session,
    *,
    q:         Optional[str]   = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort_by:   str             = "newest",
    skip:      int             = 0,
    limit:     int             = 20,
) -> list[Hub]:
    """
    Search active hubs with optional filters.

    q          — case-insensitive partial match on hub name or description
    min_price  — only return hubs whose cheapest active plan is >= min_price
    max_price  — only return hubs whose cheapest active plan is <= max_price
    sort_by    — "newest" (created_at desc) | "popular" (active subscriber count desc)
    """
    query = (
        db.query(Hub)
        .options(joinedload(Hub.creator))
        .filter(Hub.is_active == True)
    )

    # ── Keyword filter ────────────────────────────────────────────────────────
    if q:
        term = f"%{q.strip()}%"
        query = query.filter(
            Hub.name.ilike(term) | Hub.description.ilike(term)
        )

    # ── Price range filter ────────────────────────────────────────────────────
    # Build a correlated subquery: the minimum price of active plans for each hub.
    min_plan_price_sq = (
        select(func.min(Plan.price))
        .where(Plan.hub_id == Hub.id, Plan.is_active == True)
        .correlate(Hub)
        .scalar_subquery()
    )

    if min_price is not None:
        query = query.filter(min_plan_price_sq >= min_price)
    if max_price is not None:
        query = query.filter(min_plan_price_sq <= max_price)

    # ── Sorting ───────────────────────────────────────────────────────────────
    if sort_by == "popular":
        # Subquery: count of active subscribers per hub
        subscriber_count_sq = (
            select(func.count(Subscription.id))
            .where(
                Subscription.hub_id == Hub.id,
                Subscription.status == "active",
            )
            .correlate(Hub)
            .scalar_subquery()
        )
        query = query.order_by(subscriber_count_sq.desc(), Hub.created_at.desc())
    else:
        query = query.order_by(Hub.created_at.desc())

    return query.offset(skip).limit(limit).all()


def get_hub_explore_stats(db: Session, hub_ids: list[int]) -> dict[int, dict]:
    """
    Fetch aggregated stats for a batch of hub IDs in three queries (not N+1).
    Returns a dict keyed by hub_id:
        { hub_id: { subscriber_count, content_count, plan_count, starting_from, currency } }
    """
    if not hub_ids:
        return {}

    # Active subscriber counts
    sub_rows = (
        db.query(Subscription.hub_id, func.count(Subscription.id).label("cnt"))
        .filter(Subscription.hub_id.in_(hub_ids), Subscription.status == "active")
        .group_by(Subscription.hub_id)
        .all()
    )
    subscriber_counts = {row.hub_id: row.cnt for row in sub_rows}

    # Published content counts
    content_rows = (
        db.query(Content.hub_id, func.count(Content.id).label("cnt"))
        .filter(Content.hub_id.in_(hub_ids), Content.is_published == True)
        .group_by(Content.hub_id)
        .all()
    )
    content_counts = {row.hub_id: row.cnt for row in content_rows}

    # Plan counts + cheapest price + currency
    plan_rows = (
        db.query(
            Plan.hub_id,
            func.count(Plan.id).label("cnt"),
            func.min(Plan.price).label("min_price"),
        )
        .filter(Plan.hub_id.in_(hub_ids), Plan.is_active == True)
        .group_by(Plan.hub_id)
        .all()
    )
    plan_counts     = {row.hub_id: row.cnt       for row in plan_rows}
    starting_prices = {row.hub_id: float(row.min_price) for row in plan_rows if row.min_price is not None}

    # Fetch currency for the cheapest plan per hub
    cheapest_plans = (
        db.query(Plan.hub_id, Plan.currency, Plan.price)
        .filter(Plan.hub_id.in_(hub_ids), Plan.is_active == True)
        .order_by(Plan.hub_id, Plan.price.asc())
        .all()
    )
    # Take the first (cheapest) plan per hub
    currencies: dict[int, str] = {}
    for row in cheapest_plans:
        if row.hub_id not in currencies:
            currencies[row.hub_id] = row.currency

    # Merge into one dict
    stats: dict[int, dict] = {}
    for hub_id in hub_ids:
        stats[hub_id] = {
            "subscriber_count": subscriber_counts.get(hub_id, 0),
            "content_count":    content_counts.get(hub_id, 0),
            "plan_count":       plan_counts.get(hub_id, 0),
            "starting_from":    starting_prices.get(hub_id),
            "currency":         currencies.get(hub_id),
        }
    return stats


# ── Public Content Search ─────────────────────────────────────────────────────

def search_public_content(
    db: Session,
    *,
    q:            Optional[str] = None,
    content_type: Optional[str] = None,
    skip:         int           = 0,
    limit:        int           = 20,
) -> list[Content]:
    """
    Discover free published content across all active hubs.

    Only content where plan_id IS NULL is returned — plan-gated content
    cannot be previewed without a subscription to that specific plan.

    q            — case-insensitive partial match on title or description
    content_type — filter by "video" | "image" | "pdf" | "text"
    """
    query = (
        db.query(Content)
        .options(joinedload(Content.hub))
        .join(Hub, Hub.id == Content.hub_id)
        .filter(
            Content.is_published == True,
            ~Content.plans.any(),           # free/ungated only (no plan association)
            Hub.is_active        == True,   # don't surface content from inactive hubs
        )
    )

    if q:
        term = f"%{q.strip()}%"
        query = query.filter(
            Content.title.ilike(term) | Content.description.ilike(term)
        )

    if content_type:
        query = query.filter(Content.content_type == content_type)

    return (
        query
        .order_by(Content.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


# ── Creator Search ────────────────────────────────────────────────────────────

def search_creators(
    db: Session,
    *,
    q:     Optional[str] = None,
    skip:  int           = 0,
    limit: int           = 20,
) -> list[User]:
    """
    Search active creator accounts.

    q — case-insensitive partial match on username, full_name, or hub name.
        Matching on hub name means "find creators whose hub is called X"
        which is a useful discovery pattern.
    """
    query = (
        db.query(User)
        .options(joinedload(User.hub))
        .join(Hub, Hub.creator_id == User.id)          # only users WITH a hub
        .filter(
            User.role      == "creator",
            User.is_active == True,
            Hub.is_active  == True,
        )
    )

    if q:
        term = f"%{q.strip()}%"
        query = query.filter(
            User.username.ilike(term)
            | User.full_name.ilike(term)
            | Hub.name.ilike(term)
        )

    return (
        query
        .order_by(User.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )