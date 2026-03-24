# → app/services/comment.py

from sqlalchemy.orm import Session

from core.exceptions import (
    comment_not_found_exception,
    comment_not_owned_exception,
    comment_is_reply_exception,
    comment_access_denied_exception,
)
from crud.comment import (
    count_replies,
    create_comment,
    get_comment_by_id,
    get_comments_by_content,
    get_replies_by_comment,
    get_reply_counts,
    hard_delete_comment,
    soft_delete_comment,
    update_comment,
)
from crud.hub import get_hub_by_id
from crud.subscription import get_active_subscription
from crud.content import get_published_content_by_id
from models.comment import Comment
from models.user import User
from schemas.comment import CommentCreate, CommentResponse, CommentUpdate, ReplyResponse


# ── Access helpers ────────────────────────────────────────────────────────────

def _assert_content_access(db: Session, user: User, hub_id: int, content_id: int):
    """
    Raises if the user cannot read the content.
    Mirrors the gate in services/content.py so comments have identical rules.

    - Hub creator → always allowed
    - Everyone else → must have an active subscription that covers the content
    """
    from core.exceptions import (
        hub_not_found_exception,
        content_not_found_exception,
        subscription_not_found_exception,
        content_access_denied_exception,
    )

    hub = get_hub_by_id(db, hub_id)
    if not hub:
        raise hub_not_found_exception

    content = get_published_content_by_id(db, content_id=content_id, hub_id=hub_id)
    if not content:
        raise content_not_found_exception

    # Creator of the hub can always access their own content
    if user.role == "creator" and hub.creator_id == user.id:
        return content

    # Everyone else needs an active subscription
    subscription = get_active_subscription(db, member_id=user.id, hub_id=hub_id)
    if not subscription:
        raise subscription_not_found_exception

    # Check plan gate
    if content.plan_id is not None and content.plan_id != subscription.plan_id:
        raise content_access_denied_exception

    return content


def _build_comment_response(comment: Comment, reply_count: int = 0) -> CommentResponse:
    """
    Mask author + body when a comment is soft-deleted so the client sees
    '[deleted]' placeholder data without exposing the original content.
    """
    return CommentResponse(
        id=comment.id,
        content_id=comment.content_id,
        parent_id=comment.parent_id,
        author=comment.author if not comment.is_deleted else None,
        body=comment.body if not comment.is_deleted else None,
        is_deleted=comment.is_deleted,
        reply_count=reply_count,
        created_at=comment.created_at,
        updated_at=comment.updated_at,
    )


def _build_reply_response(reply: Comment) -> ReplyResponse:
    return ReplyResponse(
        id=reply.id,
        content_id=reply.content_id,
        parent_id=reply.parent_id,
        author=reply.author if not reply.is_deleted else None,
        body=reply.body if not reply.is_deleted else None,
        is_deleted=reply.is_deleted,
        created_at=reply.created_at,
        updated_at=reply.updated_at,
    )


# ── List top-level comments ───────────────────────────────────────────────────

def list_comments(
    db: Session,
    user: User,
    hub_id: int,
    content_id: int,
    skip: int = 0,
    limit: int = 20,
) -> list[CommentResponse]:
    _assert_content_access(db, user, hub_id, content_id)

    comments = get_comments_by_content(db, content_id=content_id, skip=skip, limit=limit)
    if not comments:
        return []

    # Batch-fetch reply counts — one query for all comments, never N+1
    counts = get_reply_counts(db, [c.id for c in comments])

    return [_build_comment_response(c, reply_count=counts.get(c.id, 0)) for c in comments]


# ── List replies ──────────────────────────────────────────────────────────────

def list_replies(
    db: Session,
    user: User,
    hub_id: int,
    content_id: int,
    comment_id: int,
    skip: int = 0,
    limit: int = 20,
) -> list[ReplyResponse]:
    _assert_content_access(db, user, hub_id, content_id)

    # Validate the parent comment exists and belongs to this content
    parent = get_comment_by_id(db, comment_id)
    if not parent or parent.content_id != content_id:
        raise comment_not_found_exception

    # A reply cannot have replies — block fetching "replies of a reply"
    if parent.parent_id is not None:
        raise comment_is_reply_exception

    replies = get_replies_by_comment(db, comment_id=comment_id, skip=skip, limit=limit)
    return [_build_reply_response(r) for r in replies]


# ── Post a top-level comment ──────────────────────────────────────────────────

def post_comment(
    db: Session,
    user: User,
    hub_id: int,
    content_id: int,
    data: CommentCreate,
) -> CommentResponse:
    _assert_content_access(db, user, hub_id, content_id)

    comment = create_comment(
        db, content_id=content_id, user_id=user.id, body=data.body
    )
    return _build_comment_response(comment, reply_count=0)


# ── Post a reply ──────────────────────────────────────────────────────────────

def post_reply(
    db: Session,
    user: User,
    hub_id: int,
    content_id: int,
    comment_id: int,
    data: CommentCreate,
) -> ReplyResponse:
    _assert_content_access(db, user, hub_id, content_id)

    # Validate parent exists and belongs to this content
    parent = get_comment_by_id(db, comment_id)
    if not parent or parent.content_id != content_id:
        raise comment_not_found_exception

    # Enforce one-level nesting: cannot reply to a reply
    if parent.parent_id is not None:
        raise comment_is_reply_exception

    reply = create_comment(
        db,
        content_id=content_id,
        user_id=user.id,
        body=data.body,
        parent_id=comment_id,
    )
    return _build_reply_response(reply)


# ── Edit a comment ────────────────────────────────────────────────────────────

def edit_comment(
    db: Session,
    user: User,
    comment_id: int,
    data: CommentUpdate,
) -> CommentResponse | ReplyResponse:
    comment = get_comment_by_id(db, comment_id)
    if not comment:
        raise comment_not_found_exception

    # Only the original author can edit
    if comment.user_id != user.id:
        raise comment_not_owned_exception

    # Cannot edit a soft-deleted comment
    if comment.is_deleted:
        raise comment_access_denied_exception

    updated = update_comment(db, comment, data.body)

    if updated.parent_id is None:
        replies = count_replies(db, updated.id)
        return _build_comment_response(updated, reply_count=replies)
    return _build_reply_response(updated)


# ── Delete a comment ──────────────────────────────────────────────────────────

def delete_comment(db: Session, user: User, comment_id: int) -> dict:
    """
    - The comment author can delete their own comment.
    - The hub creator can delete any comment on their content (moderation).
    - If the comment has replies → soft delete (preserve the thread).
    - If no replies → hard delete (clean removal).
    """
    comment = get_comment_by_id(db, comment_id)
    if not comment:
        raise comment_not_found_exception

    # Determine permission: own comment OR hub creator moderating
    is_own_comment = comment.user_id == user.id
    is_hub_creator = _is_hub_creator_of_content(db, user, comment.content_id)

    if not is_own_comment and not is_hub_creator:
        raise comment_not_owned_exception

    # Already soft-deleted — nothing to do
    if comment.is_deleted:
        return {"message": "Comment deleted."}

    if count_replies(db, comment_id) > 0:
        soft_delete_comment(db, comment)
    else:
        hard_delete_comment(db, comment)

    return {"message": "Comment deleted."}


# ── Private helper ────────────────────────────────────────────────────────────

def _is_hub_creator_of_content(db: Session, user: User, content_id: int) -> bool:
    """Check whether `user` is the creator of the hub that owns this content."""
    if user.role != "creator":
        return False
    from crud.content import get_content_by_id
    from crud.hub import get_hub_by_id
    content = get_content_by_id(db, content_id)
    if not content:
        return False
    hub = get_hub_by_id(db, content.hub_id)
    return hub is not None and hub.creator_id == user.id