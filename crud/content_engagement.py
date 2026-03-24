# → app/crud/content_engagement.py

import uuid

from sqlalchemy import func
from sqlalchemy.orm import Session

from models.content_engagement import ContentLike, ContentView


# ── Views ─────────────────────────────────────────────────────────────────────

def record_view(db: Session, user_id: uuid.UUID, content_id: int) -> None:
    """
    Insert a view row if one doesn't already exist for this user+content pair.
    Uses INSERT ... ON CONFLICT DO NOTHING via a try/except so it's safe to
    call on every content fetch without checking first.
    """
    from sqlalchemy.dialects.postgresql import insert as pg_insert
    from sqlalchemy.exc import IntegrityError

    try:
        view = ContentView(user_id=user_id, content_id=content_id)
        db.add(view)
        db.commit()
    except IntegrityError:
        # Already viewed — unique constraint fired, just roll back and continue
        db.rollback()


def get_view_count(db: Session, content_id: int) -> int:
    return db.query(ContentView).filter(ContentView.content_id == content_id).count()


def get_view_counts_batch(db: Session, content_ids: list[int]) -> dict[int, int]:
    """Batch-fetch view counts for a list of content IDs — one query, never N+1."""
    if not content_ids:
        return {}
    rows = (
        db.query(ContentView.content_id, func.count(ContentView.id).label("cnt"))
        .filter(ContentView.content_id.in_(content_ids))
        .group_by(ContentView.content_id)
        .all()
    )
    return {row.content_id: row.cnt for row in rows}


# ── Likes ─────────────────────────────────────────────────────────────────────

def get_like_entry(db: Session, user_id: uuid.UUID, content_id: int) -> ContentLike | None:
    return (
        db.query(ContentLike)
        .filter(ContentLike.user_id == user_id, ContentLike.content_id == content_id)
        .first()
    )


def get_like_count(db: Session, content_id: int) -> int:
    return db.query(ContentLike).filter(ContentLike.content_id == content_id).count()


def get_like_counts_batch(db: Session, content_ids: list[int]) -> dict[int, int]:
    """Batch-fetch like counts for a list of content IDs — one query, never N+1."""
    if not content_ids:
        return {}
    rows = (
        db.query(ContentLike.content_id, func.count(ContentLike.id).label("cnt"))
        .filter(ContentLike.content_id.in_(content_ids))
        .group_by(ContentLike.content_id)
        .all()
    )
    return {row.content_id: row.cnt for row in rows}


def get_liked_content_ids(db: Session, user_id: uuid.UUID, content_ids: list[int]) -> set[int]:
    """
    Returns the subset of content_ids that the given user has liked.
    Used to batch-populate is_liked on content lists.
    """
    if not content_ids:
        return set()
    rows = (
        db.query(ContentLike.content_id)
        .filter(
            ContentLike.user_id == user_id,
            ContentLike.content_id.in_(content_ids),
        )
        .all()
    )
    return {row.content_id for row in rows}


def add_like(db: Session, user_id: uuid.UUID, content_id: int) -> ContentLike:
    like = ContentLike(user_id=user_id, content_id=content_id)
    db.add(like)
    db.commit()
    db.refresh(like)
    return like


def remove_like(db: Session, like: ContentLike) -> None:
    db.delete(like)
    db.commit()
