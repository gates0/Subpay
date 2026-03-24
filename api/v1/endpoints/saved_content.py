# → app/api/v1/saved_content.py

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from dependencies import get_current_onboarded_user, get_db
from models.user import User
from schemas.saved_content import SavedContentResponse, ToggleSaveResponse
from services.saved_content import list_saved_content, toggle_save

router = APIRouter(tags=["saved content"])


# ── TOGGLE SAVE / UNSAVE ──────────────────────────────────────────────────────

@router.post(
    "/content/{content_id}/save",
    response_model=ToggleSaveResponse,
)
def toggle_saved(
    content_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    Save or unsave a piece of content (bookmark toggle).

    - If the content is **not yet saved** → saves it, returns `is_saved: true`.
    - If the content is **already saved** → unsaves it, returns `is_saved: false`.

    The caller must have access to the content (active subscription covering it,
    or be the hub creator). Returns 403 otherwise.

    Designed for a single-tap bookmark button — call the same endpoint again
    to undo.
    """
    return toggle_save(db, current_user, content_id)


# ── LIST SAVED CONTENT ────────────────────────────────────────────────────────

@router.get(
    "/users/me/saved",
    response_model=list[SavedContentResponse],
)
def get_saved_content(
    skip:  int = Query(0,  ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    Retrieve the current user's saved/bookmarked content, newest saves first.

    Each item includes the full content card (title, type, thumbnail) and the
    hub it belongs to, so the frontend can render the bookmarks list without
    any extra requests.

    Note: if a saved piece of content is deleted or unpublished by the creator
    after it was bookmarked, the bookmark row is automatically removed by the
    database `ON DELETE CASCADE` on `contents.id`.
    """
    return list_saved_content(db, current_user, skip=skip, limit=limit)