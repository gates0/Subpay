import uuid
from sqlalchemy.orm import Session

from models.hub import Hub
from schemas.hub import HubUpdate


# ── Lookups ───────────────────────────────────────────────────────────────────

def get_hub_by_id(db: Session, hub_id: int) -> Hub | None:
    return db.query(Hub).filter(Hub.id == hub_id).first()


def get_hub_by_creator_id(db: Session, creator_id: uuid.UUID) -> Hub | None:
    return db.query(Hub).filter(Hub.creator_id == creator_id).first()


def get_all_active_hubs(db: Session, skip: int = 0, limit: int = 20) -> list[Hub]:
    return (
        db.query(Hub)
        .filter(Hub.is_active == True)
        .offset(skip)
        .limit(limit)
        .all()
    )


# ── Creation ──────────────────────────────────────────────────────────────────

def create_hub(db: Session, creator_id: int, name: str) -> Hub:
    """
    Create a hub for a creator. Called automatically when:
      - A user registers directly as a creator
      - A member upgrades via POST /users/me/become-creator
    """
    hub = Hub(creator_id=creator_id, name=name)
    db.add(hub)
    db.commit()
    db.refresh(hub)
    return hub


# ── Updates ───────────────────────────────────────────────────────────────────

def update_hub(db: Session, hub: Hub, data: HubUpdate) -> Hub:
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(hub, field, value)
    db.commit()
    db.refresh(hub)
    return hub


# ── Stats ─────────────────────────────────────────────────────────────────────

def get_hub_stats(db: Session, hub_id: int) -> dict:
    """
    Returns aggregated counts for a hub dashboard.
    Subscriber and content counts will be filled in as those modules are built.
    """
    from models.plan import Plan  # local imports avoid circular dependencies
    from models.subscription import Subscription
    from models.content import Content

    total_plans = db.query(Plan).filter(Plan.hub_id == hub_id).count()
    total_subscribers = (
        db.query(Subscription)
        .filter(Subscription.hub_id == hub_id, Subscription.status == "active")
        .count()
    )
    total_content_items = (
        db.query(Content)
        .filter(Content.hub_id == hub_id, Content.is_published == True)
        .count()
    )

    return {
        "hub_id": hub_id,
        "total_subscribers": total_subscribers,
        "total_content_items": total_content_items,
        "total_plans": total_plans,
    }