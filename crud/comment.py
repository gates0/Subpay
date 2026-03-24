# → app/crud/comment.py

import uuid

from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from models.comment import Comment


# ── Lookups ───────────────────────────────────────────────────────────────────

def get_comment_by_id(db: Session, comment_id: int) -> Comment | None:
    return (
        db.query(Comment)
        .options(joinedload(Comment.author))
        .filter(Comment.id == comment_id)
        .first()
    )


def get_comments_by_content(
    db: Session, content_id: int, skip: int = 0, limit: int = 20
) -> list[Comment]:
    """
    Return top-level (non-reply) comments for a piece of content, newest first.
    Deleted comments are included so that reply chains remain intact —
    the service layer masks the body and author before returning.
    """
    return (
        db.query(Comment)
        .options(joinedload(Comment.author))
        .filter(Comment.content_id == content_id, Comment.parent_id == None)
        .order_by(Comment.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_replies_by_comment(
    db: Session, comment_id: int, skip: int = 0, limit: int = 20
) -> list[Comment]:
    """Return all replies to a specific comment, oldest first (chronological)."""
    return (
        db.query(Comment)
        .options(joinedload(Comment.author))
        .filter(Comment.parent_id == comment_id)
        .order_by(Comment.created_at.asc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_reply_counts(db: Session, comment_ids: list[int]) -> dict[int, int]:
    """
    Batch-fetch reply counts for a list of comment IDs.
    Returns { comment_id: count } — avoids N+1 when rendering a list of comments.
    """
    if not comment_ids:
        return {}
    rows = (
        db.query(Comment.parent_id, func.count(Comment.id).label("cnt"))
        .filter(Comment.parent_id.in_(comment_ids))
        .group_by(Comment.parent_id)
        .all()
    )
    return {row.parent_id: row.cnt for row in rows}


def count_replies(db: Session, comment_id: int) -> int:
    return db.query(Comment).filter(Comment.parent_id == comment_id).count()


# ── Creation ──────────────────────────────────────────────────────────────────

def create_comment(
    db: Session,
    *,
    content_id: int,
    user_id: uuid.UUID,
    body: str,
    parent_id: int | None = None,
) -> Comment:
    comment = Comment(
        content_id=content_id,
        user_id=user_id,
        body=body,
        parent_id=parent_id,
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    # Reload with author joined so the response schema can populate it
    return get_comment_by_id(db, comment.id)


# ── Updates ───────────────────────────────────────────────────────────────────

def update_comment(db: Session, comment: Comment, body: str) -> Comment:
    comment.body = body
    db.commit()
    db.refresh(comment)
    return comment


# ── Deletion ──────────────────────────────────────────────────────────────────

def soft_delete_comment(db: Session, comment: Comment) -> Comment:
    """
    Soft-delete: clear the body, mark as deleted, keep the row.
    Used when the comment has replies so the reply chain is preserved.
    """
    comment.body = None
    comment.is_deleted = True
    db.commit()
    db.refresh(comment)
    return comment


def hard_delete_comment(db: Session, comment: Comment) -> None:
    """
    Hard-delete: remove the row entirely.
    Safe to use only when the comment has no replies.
    """
    db.delete(comment)
    db.commit()