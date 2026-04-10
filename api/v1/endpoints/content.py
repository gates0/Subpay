# → app/api/v1/content.py

from typing import Optional

from fastapi import APIRouter, Depends, File, Form, UploadFile, status
from sqlalchemy.orm import Session

from dependencies import get_current_onboarded_user, get_db
from models.user import User
from schemas.content import (
    ContentCreate,
    ContentPublicResponse,
    ContentResponse,
    ContentType,
    ContentUpdate,
)
from schemas.user import MessageResponse
from services.content import (
    create_hub_content,
    delete_my_content,
    get_hub_content_for_member,
    get_my_content,
    list_hub_content_for_member,
    list_my_hub_content,
    toggle_my_content_pin,
    toggle_my_content_publish,
    update_my_content,
)

router = APIRouter(tags=["content"])


# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║                        CREATOR ENDPOINTS                                    ║
# ║                     /hubs/me/content/...                                    ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# ── CREATE CONTENT ────────────────────────────────────────────────────────────

@router.post(
    "/hubs/me/content",
    response_model=ContentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_content(
    # All fields come in as Form fields so the endpoint can also accept a file
    title:        str         = Form(...),
    content_type: ContentType = Form(...),
    description:  Optional[str] = Form(None),
    text_body:    Optional[str] = Form(None),
    plan_ids:     list[int]    = Form(default=[]),
    file:         Optional[UploadFile] = File(None),
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_onboarded_user),
):
    """
    Upload or create a new piece of content on the creator's hub.

    - **text**  → send `text_body` in the form, no file needed.
    - **video / image / pdf** → attach the file in `file`, no `text_body` needed.

    Content is always saved as a **draft** (`is_published=false`) and must be
    published separately via `PATCH /hubs/me/content/{id}/publish`.

    Optionally pass one or more `plan_ids` to gate this content to specific plans.
    Leave empty to make it accessible to all active subscribers.
    """
    data = ContentCreate(
        title=title,
        description=description,
        content_type=content_type,
        text_body=text_body,
        plan_ids=plan_ids,
    )
    return await create_hub_content(db, current_user, data, file)


# ── LIST ALL CONTENT ON OWN HUB (includes drafts) ────────────────────────────

@router.get("/hubs/me/content", response_model=list[ContentResponse])
def list_my_content(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    List all content on the creator's hub — including unpublished drafts.
    Pinned content appears first, then newest first.
    """
    return list_my_hub_content(db, current_user)


# ── GET A SINGLE CONTENT ITEM (creator) ──────────────────────────────────────

@router.get("/hubs/me/content/{content_id}", response_model=ContentResponse)
def get_my_content_item(
    content_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """Fetch a specific content item from the creator's own hub."""
    return get_my_content(db, current_user, content_id)


# ── UPDATE CONTENT METADATA ───────────────────────────────────────────────────

@router.put("/hubs/me/content/{content_id}", response_model=ContentResponse)
def update_content_item(
    content_id: int,
    data: ContentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    Update content metadata: title, description, text_body, thumbnail_url, plan_id.
    The file itself cannot be replaced via this endpoint — delete and re-upload instead.
    """
    return update_my_content(db, current_user, content_id, data)


# ── DELETE CONTENT ────────────────────────────────────────────────────────────

@router.delete(
    "/hubs/me/content/{content_id}",
    response_model=MessageResponse,
    status_code=status.HTTP_200_OK,
)
def delete_content_item(
    content_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    Permanently delete a content item and its associated file from disk.
    This action cannot be undone.
    """
    return delete_my_content(db, current_user, content_id)


# ── PUBLISH / UNPUBLISH ───────────────────────────────────────────────────────

@router.patch("/hubs/me/content/{content_id}/publish", response_model=ContentResponse)
def toggle_publish(
    content_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    Toggle a content item between published and draft.
    Only published content is visible to members.
    """
    return toggle_my_content_publish(db, current_user, content_id)


# ── PIN / UNPIN ───────────────────────────────────────────────────────────────

@router.patch("/hubs/me/content/{content_id}/pin", response_model=ContentResponse)
def toggle_pin(
    content_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    Toggle whether a content item is pinned to the top of the hub.
    Pinned content always appears first in listing responses.
    """
    return toggle_my_content_pin(db, current_user, content_id)


# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║                        MEMBER ENDPOINTS                                     ║
# ║                     /hubs/{hub_id}/content/...                              ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# ── LIST ACCESSIBLE CONTENT ON A HUB ─────────────────────────────────────────

@router.get("/hubs/{hub_id}/content", response_model=list[ContentPublicResponse])
def list_hub_content(
    hub_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    List all content accessible to the authenticated user on a hub.

    Access rules:
    - Must have an active subscription to this hub.
    - Content with no `plan_id` → visible to all active subscribers.
    - Content with a `plan_id` → only visible to subscribers on that exact plan.
    - The hub's own creator can always see all published content.
    """
    return list_hub_content_for_member(db, current_user, hub_id)


# ── GET A SINGLE CONTENT ITEM (member) ───────────────────────────────────────

@router.get("/hubs/{hub_id}/content/{content_id}", response_model=ContentPublicResponse)
def get_hub_content_item(
    hub_id: int,
    content_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    Fetch a specific content item on a hub.
    Access is checked against the user's active subscription plan.
    Returns 403 if the content is gated behind a plan the user is not subscribed to.
    """
    return get_hub_content_for_member(db, current_user, hub_id, content_id)