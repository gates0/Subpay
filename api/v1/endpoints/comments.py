# → app/api/v1/comments.py

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from dependencies import get_current_onboarded_user, get_db
from models.user import User
from schemas.comment import (
    CommentCreate,
    CommentResponse,
    CommentUpdate,
    ReplyResponse,
)
from schemas.user import MessageResponse
from services.comment import (
    delete_comment,
    edit_comment,
    list_comments,
    list_replies,
    post_comment,
    post_reply,
)

router = APIRouter(tags=["comments"])


# ── LIST TOP-LEVEL COMMENTS ───────────────────────────────────────────────────

@router.get(
    "/hubs/{hub_id}/content/{content_id}/comments",
    response_model=list[CommentResponse],
)
def get_comments(
    hub_id:     int,
    content_id: int,
    skip:  int = Query(0,  ge=0),
    limit: int = Query(20, ge=1, le=100),
    db:   Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    List top-level comments on a piece of content.

    Requires the same access as viewing the content itself — the caller must
    have an active subscription that covers this content (or be the hub creator).

    Soft-deleted comments are included so reply threads remain intact,
    but their `body` and `author` will be `null` and `is_deleted` will be `true`.

    Results are paginated, newest first.
    """
    return list_comments(db, current_user, hub_id, content_id, skip=skip, limit=limit)


# ── POST A TOP-LEVEL COMMENT ──────────────────────────────────────────────────

@router.post(
    "/hubs/{hub_id}/content/{content_id}/comments",
    response_model=CommentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_comment(
    hub_id:     int,
    content_id: int,
    data: CommentCreate,
    db:   Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    Post a top-level comment on a piece of content.

    Requires an active subscription that covers the content (or hub creator).
    Body must be 1–2000 characters.
    """
    return post_comment(db, current_user, hub_id, content_id, data)


# ── LIST REPLIES ──────────────────────────────────────────────────────────────

@router.get(
    "/hubs/{hub_id}/content/{content_id}/comments/{comment_id}/replies",
    response_model=list[ReplyResponse],
)
def get_replies(
    hub_id:     int,
    content_id: int,
    comment_id: int,
    skip:  int = Query(0,  ge=0),
    limit: int = Query(20, ge=1, le=100),
    db:   Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    List replies to a specific top-level comment.

    Replies are returned oldest first (chronological) so the conversation
    reads naturally top-to-bottom.

    Returns 400 if the `comment_id` is itself a reply — replies cannot be
    nested further.
    """
    return list_replies(db, current_user, hub_id, content_id, comment_id, skip=skip, limit=limit)


# ── POST A REPLY ──────────────────────────────────────────────────────────────

@router.post(
    "/hubs/{hub_id}/content/{content_id}/comments/{comment_id}/replies",
    response_model=ReplyResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_reply(
    hub_id:     int,
    content_id: int,
    comment_id: int,
    data: CommentCreate,
    db:   Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    Reply to a top-level comment.

    Returns 400 if `comment_id` is itself a reply — only one level of nesting
    is supported.
    """
    return post_reply(db, current_user, hub_id, content_id, comment_id, data)


# ── EDIT A COMMENT ────────────────────────────────────────────────────────────

@router.patch("/comments/{comment_id}", response_model=CommentResponse | ReplyResponse)
def update_comment(
    comment_id: int,
    data: CommentUpdate,
    db:   Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    Edit the body of your own comment or reply.

    Only the original author can edit. Soft-deleted comments cannot be edited.
    Returns the updated comment in the same shape as when it was created
    (CommentResponse for top-level, ReplyResponse for replies).
    """
    return edit_comment(db, current_user, comment_id, data)


# ── DELETE A COMMENT ──────────────────────────────────────────────────────────

@router.delete(
    "/comments/{comment_id}",
    response_model=MessageResponse,
    status_code=status.HTTP_200_OK,
)
def remove_comment(
    comment_id: int,
    db:   Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    Delete a comment or reply.

    **Who can delete:**
    - The comment author (their own comment)
    - The hub creator (moderation — can delete any comment on their content)

    **How deletion works:**
    - If the comment has replies → soft delete: body and author are cleared,
      `is_deleted` is set to `true`, the row is kept so the reply thread survives.
    - If the comment has no replies → hard delete: the row is removed entirely.
    """
    return delete_comment(db, current_user, comment_id)