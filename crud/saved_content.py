# → app/crud/saved_content.py

import uuid

from sqlalchemy.orm import Session, joinedload

from models.content import Content
from models.saved_content import SavedContent


# ── Lookups ───────────────────────────────────────────────────────────────────

def get_saved_entry(db: Session, user_id: uuid.UUID, content_id: int) -> SavedContent | None:
    """Return the SavedContent row if the user has bookmarked this content, else None."""
    return (
        db.query(SavedContent)
        .filter(SavedContent.user_id == user_id, SavedContent.content_id == content_id)
        .first()
    )


def get_saved_contents_by_user(
    db: Session, user_id: uuid.UUID, skip: int = 0, limit: int = 20
) -> list[SavedContent]:
    """
    Return a user's saved bookmarks newest-first, with content + hub eagerly loaded
    so the service can build responses without extra queries.
    """
    return (
        db.query(SavedContent)
        .options(
            joinedload(SavedContent.content).joinedload(Content.hub)
        )
        .filter(SavedContent.user_id == user_id)
        .order_by(SavedContent.saved_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def count_saved_by_user(db: Session, user_id: uuid.UUID) -> int:
    return db.query(SavedContent).filter(SavedContent.user_id == user_id).count()


# ── Toggle ────────────────────────────────────────────────────────────────────

def save_content(db: Session, user_id: uuid.UUID, content_id: int) -> SavedContent:
    """Create a bookmark row. Caller must check it doesn't already exist."""
    entry = SavedContent(user_id=user_id, content_id=content_id)
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def unsave_content(db: Session, entry: SavedContent) -> None:
    """Delete the bookmark row."""
    db.delete(entry)
    db.commit()