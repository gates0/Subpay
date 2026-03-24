# → app/api/v1/content_engagement.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from dependencies import get_current_onboarded_user, get_db
from models.user import User
from schemas.content import LikeToggleResponse
from services.content_engagement import toggle_like

router = APIRouter(tags=["content engagement"])


@router.post("/content/{content_id}/like", response_model=LikeToggleResponse)
def toggle_content_like(
    content_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    Like or unlike a piece of content (toggle).

    - If not yet liked → likes it, returns `is_liked: true` + new `like_count`.
    - If already liked → removes the like, returns `is_liked: false` + new `like_count`.

    Requires the same access as viewing the content — an active subscription
    covering the content or hub creator status. Returns 403 otherwise.

    Views are tracked separately and recorded automatically whenever a member
    calls `GET /hubs/{hub_id}/content/{content_id}`. There is no separate
    view endpoint — views are a passive measurement, likes are an active action.
    """
    return toggle_like(db, current_user, content_id)