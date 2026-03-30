# → app/crud/content.py

from sqlalchemy.orm import Session, joinedload

from models.content import Content
from schemas.content import ContentCreate, ContentUpdate


# ── Lookups ───────────────────────────────────────────────────────────────────

def get_content_by_id(db: Session, content_id: int) -> Content | None:
    return (
        db.query(Content)
        .options(joinedload(Content.plan))
        .filter(Content.id == content_id)
        .first()
    )


def get_contents_by_hub(
    db: Session,
    hub_id: int,
    published_only: bool = False,
) -> list[Content]:
    """
    Fetch all content for a hub.
    published_only=True  → member-facing queries (only published, pinned first)
    published_only=False → creator-facing queries (all content including drafts)
    """
    query = (
        db.query(Content)
        .options(joinedload(Content.plan))
        .filter(Content.hub_id == hub_id)
    )
    if published_only:
        query = query.filter(Content.is_published == True)

    # Pinned content floats to the top, then newest first
    return query.order_by(Content.is_pinned.desc(), Content.created_at.desc()).all()


def get_contents_by_plan(db: Session, hub_id: int, plan_id: int) -> list[Content]:
    """Return all content (including drafts) gated to a specific plan on this hub."""
    return (
        db.query(Content)
        .options(joinedload(Content.plan))
        .filter(Content.hub_id == hub_id, Content.plan_id == plan_id)
        .order_by(Content.is_pinned.desc(), Content.created_at.desc())
        .all()
    )


def get_published_content_by_id(db: Session, content_id: int, hub_id: int) -> Content | None:
    """Fetch a single published content item scoped to a hub."""
    return (
        db.query(Content)
        .options(joinedload(Content.plan))
        .filter(
            Content.id == content_id,
            Content.hub_id == hub_id,
            Content.is_published == True,
        )
        .first()
    )


# ── Creation ──────────────────────────────────────────────────────────────────

def create_content(
    db: Session,
    hub_id: int,
    data: ContentCreate,
    file_url: str | None = None,
) -> Content:
    content = Content(
        hub_id=hub_id,
        plan_id=data.plan_id,
        title=data.title,
        description=data.description,
        content_type=data.content_type,
        text_body=data.text_body,
        file_url=file_url,
        is_published=False,  # always starts as a draft
    )
    db.add(content)
    db.commit()
    db.refresh(content)
    return content


# ── Updates ───────────────────────────────────────────────────────────────────

def update_content(db: Session, content: Content, data: ContentUpdate) -> Content:
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(content, field, value)
    db.commit()
    db.refresh(content)
    return content


def toggle_publish(db: Session, content: Content) -> Content:
    content.is_published = not content.is_published
    db.commit()
    db.refresh(content)
    return content


def toggle_pin(db: Session, content: Content) -> Content:
    content.is_pinned = not content.is_pinned
    db.commit()
    db.refresh(content)
    return content


# ── Deletion ──────────────────────────────────────────────────────────────────

def delete_content(db: Session, content: Content) -> None:
    db.delete(content)
    db.commit()


# ── Counts (used by hub stats) ────────────────────────────────────────────────

def count_published_content(db: Session, hub_id: int) -> int:
    return (
        db.query(Content)
        .filter(Content.hub_id == hub_id, Content.is_published == True)
        .count()
    )