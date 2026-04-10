# → app/services/content.py

import io
import os
import uuid
from typing import Optional

from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from core.exceptions import (
    content_not_found_exception,
    content_access_denied_exception,
    content_wrong_type_for_upload_exception,
    content_missing_text_body_exception,
    content_missing_file_exception,
    content_plan_not_on_hub_exception,
    hub_not_found_exception,
    not_a_creator_exception,
    subscription_not_found_exception,
)
from crud.content import (
    count_published_content,
    create_content,
    delete_content,
    get_content_by_id,
    get_contents_by_hub,
    get_contents_by_plan,
    get_published_content_by_id,
    toggle_pin,
    toggle_publish,
    update_content,
)
from crud.hub import get_hub_by_creator_id, get_hub_by_id
from crud.subscription import get_subscribers_by_hub, get_active_subscriptions_for_hub
from crud.plan import get_plan_by_id
from crud.content_engagement import (
    get_like_count,
    get_like_counts_batch,
    get_like_entry,
    get_liked_content_ids,
    get_view_count,
    get_view_counts_batch,
    record_view,
)
from models.content import Content
from models.user import User
from schemas.content import ContentCreate, ContentUpdate
from services.notification import notify_new_content

# ── Cloudinary config ─────────────────────────────────────────────────────────

import cloudinary
import cloudinary.uploader

from config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True,
)

ALLOWED_EXTENSIONS = {
    "video": {".mp4", ".mov", ".avi", ".mkv", ".webm"},
    "image": {".jpg", ".jpeg", ".png", ".gif", ".webp"},
    "pdf":   {".pdf"},
}
MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024  # 500 MB

# Cloudinary resource type per content type
_CLOUDINARY_RESOURCE_TYPE = {
    "video": "video",
    "image": "image",
    "pdf":   "raw",
}


# ── Creator: Create Content ───────────────────────────────────────────────────

async def create_hub_content(
    db: Session,
    current_user: User,
    data: ContentCreate,
    file: Optional[UploadFile] = None,
) -> Content:
    _require_creator(current_user)
    hub = _get_creator_hub(db, current_user)

    # Validate every plan_id provided belongs to this hub
    if data.plan_ids:
        for pid in data.plan_ids:
            plan = get_plan_by_id(db, pid)
            if not plan or plan.hub_id != hub.id:
                raise content_plan_not_on_hub_exception

    file_url: Optional[str] = None

    if data.content_type == "text":
        # Text content must have a body; no file allowed
        if not data.text_body or not data.text_body.strip():
            raise content_missing_text_body_exception
        if file:
            raise content_wrong_type_for_upload_exception

    else:
        # File-based content must have a file
        if not file:
            raise content_missing_file_exception
        file_url = await _save_upload(file, data.content_type)

    return create_content(db, hub_id=hub.id, data=data, file_url=file_url)


# ── Creator: List Content by Plan ────────────────────────────────────────────

def list_my_plan_content(
    db: Session, current_user: User, plan_id: int
) -> list[Content]:
    _require_creator(current_user)
    hub = _get_creator_hub(db, current_user)
    plan = get_plan_by_id(db, plan_id)
    if not plan or plan.hub_id != hub.id:
        raise content_plan_not_on_hub_exception

    items = get_contents_by_plan(db, hub_id=hub.id, plan_id=plan_id)
    _attach_engagement(db, items, viewer_id=current_user.id)
    return items


# ── Creator: List Own Hub Content (all — includes drafts) ─────────────────────

def list_my_hub_content(db: Session, current_user: User) -> list[Content]:
    _require_creator(current_user)
    hub = _get_creator_hub(db, current_user)
    return get_contents_by_hub(db, hub_id=hub.id, published_only=False)


# ── Creator: Get Single Content Item ─────────────────────────────────────────

def get_my_content(db: Session, current_user: User, content_id: int) -> Content:
    _require_creator(current_user)
    hub = _get_creator_hub(db, current_user)
    content = get_content_by_id(db, content_id)
    _validate_content_on_hub(content, hub.id)
    return content


# ── Creator: Update Content ───────────────────────────────────────────────────

def update_my_content(
    db: Session, current_user: User, content_id: int, data: ContentUpdate
) -> Content:
    _require_creator(current_user)
    hub = _get_creator_hub(db, current_user)
    content = get_content_by_id(db, content_id)
    _validate_content_on_hub(content, hub.id)

    # Validate any new plan gates belong to this hub
    if data.plan_ids is not None:
        for pid in data.plan_ids:
            plan = get_plan_by_id(db, pid)
            if not plan or plan.hub_id != hub.id:
                raise content_plan_not_on_hub_exception

    return update_content(db, content, data)


# ── Creator: Delete Content ───────────────────────────────────────────────────

def delete_my_content(db: Session, current_user: User, content_id: int) -> dict:
    _require_creator(current_user)
    hub = _get_creator_hub(db, current_user)
    content = get_content_by_id(db, content_id)
    _validate_content_on_hub(content, hub.id)

    if content.file_url:
        _delete_file(content.file_url)

    delete_content(db, content)
    return {"message": "Content deleted successfully."}


# ── Creator: Publish / Unpublish ──────────────────────────────────────────────

def toggle_my_content_publish(
    db: Session, current_user: User, content_id: int
) -> Content:
    _require_creator(current_user)
    hub = _get_creator_hub(db, current_user)
    content = get_content_by_id(db, content_id)
    _validate_content_on_hub(content, hub.id)

    was_draft = not content.is_published
    updated   = toggle_publish(db, content)

    # Only notify subscribers when going draft → published, not the reverse
    if was_draft and updated.is_published:
        subscribers = get_subscribers_by_hub(db, hub_id=hub.id)
        for sub in subscribers:
            if sub.status == "active":
                notify_new_content(
                    db,
                    user_id=sub.member_id,
                    hub_name=hub.name,
                    content_title=updated.title,
                    hub_id=hub.id,
                    content_id=updated.id,
                )

    return updated


# ── Creator: Pin / Unpin ──────────────────────────────────────────────────────

def toggle_my_content_pin(
    db: Session, current_user: User, content_id: int
) -> Content:
    _require_creator(current_user)
    hub = _get_creator_hub(db, current_user)
    content = get_content_by_id(db, content_id)
    _validate_content_on_hub(content, hub.id)
    return toggle_pin(db, content)


# ── Member: List Accessible Content on a Hub ─────────────────────────────────

def list_hub_content_for_member(
    db: Session, current_user: User, hub_id: int
) -> list[Content]:
    hub = get_hub_by_id(db, hub_id)
    if not hub:
        raise hub_not_found_exception

    # Creators can always see all their own published content without a subscription
    if current_user.role == "creator" and hub.creator_id == current_user.id:
        items = get_contents_by_hub(db, hub_id=hub_id, published_only=True)
        _attach_engagement(db, items, viewer_id=current_user.id)
        return items

    # Everyone else must have at least one active subscription to this hub
    active_subs = get_active_subscriptions_for_hub(db, member_id=current_user.id, hub_id=hub_id)
    if not active_subs:
        raise subscription_not_found_exception

    all_published = get_contents_by_hub(db, hub_id=hub_id, published_only=True)

    # Access rule:
    # - Content with no plan gates → visible to all active subscribers
    # - Content with plan gates → visible only if the member holds an active
    #   subscription to at least one of those plans
    subscribed_plan_ids = {sub.plan_id for sub in active_subs}
    items = [
        item for item in all_published
        if not item.plans or any(p.id in subscribed_plan_ids for p in item.plans)
    ]
    _attach_engagement(db, items, viewer_id=current_user.id)
    return items


# ── Member: Get a Single Content Item ────────────────────────────────────────

def get_hub_content_for_member(
    db: Session, current_user: User, hub_id: int, content_id: int
) -> Content:
    hub = get_hub_by_id(db, hub_id)
    if not hub:
        raise hub_not_found_exception

    content = get_published_content_by_id(db, content_id=content_id, hub_id=hub_id)
    if not content:
        raise content_not_found_exception

    # Creators bypass the access check on their own hub
    if current_user.role == "creator" and hub.creator_id == current_user.id:
        _attach_engagement(db, [content], viewer_id=current_user.id)
        return content

    active_subs = get_active_subscriptions_for_hub(db, member_id=current_user.id, hub_id=hub_id)
    if not active_subs:
        raise subscription_not_found_exception

    # If the content is gated to specific plans, the member must hold one of them
    if content.plans:
        subscribed_plan_ids = {sub.plan_id for sub in active_subs}
        if not any(p.id in subscribed_plan_ids for p in content.plans):
            raise content_access_denied_exception

    # Record unique view and attach engagement stats
    record_view(db, user_id=current_user.id, content_id=content_id)
    _attach_engagement(db, [content], viewer_id=current_user.id)
    return content


def _attach_engagement(db, items: list, viewer_id: int) -> None:
    """
    Attach view_count, like_count, and is_liked to a list of Content ORM objects
    in-place using 3 batch queries total regardless of list length.
    Pydantic reads these as regular attributes via from_attributes=True.
    """
    if not items:
        return
    ids = [item.id for item in items]
    view_counts  = get_view_counts_batch(db, ids)
    like_counts  = get_like_counts_batch(db, ids)
    liked_ids    = get_liked_content_ids(db, viewer_id, ids)
    for item in items:
        item.view_count = view_counts.get(item.id, 0)
        item.like_count = like_counts.get(item.id, 0)
        item.is_liked   = item.id in liked_ids


# ── Private Helpers ───────────────────────────────────────────────────────────

def _require_creator(user: User) -> None:
    if user.role != "creator":
        raise not_a_creator_exception


def _get_creator_hub(db: Session, user: User):
    hub = get_hub_by_creator_id(db, user.id)
    if not hub:
        raise hub_not_found_exception
    return hub


def _validate_content_on_hub(content: Content | None, hub_id: int) -> None:
    if not content:
        raise content_not_found_exception
    if content.hub_id != hub_id:
        raise content_not_found_exception  # intentionally vague — don't leak other hubs


async def _save_upload(file: UploadFile, content_type: str) -> str:
    """Upload a file to Cloudinary and return its secure URL."""
    ext = os.path.splitext(file.filename or "")[1].lower()
    allowed = ALLOWED_EXTENSIONS.get(content_type, set())
    if ext not in allowed:
        raise content_wrong_type_for_upload_exception

    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        from core.exceptions import content_file_too_large_exception
        raise content_file_too_large_exception

    public_id = f"content/{content_type}/{uuid.uuid4().hex}"
    resource_type = _CLOUDINARY_RESOURCE_TYPE[content_type]

    try:
        result = cloudinary.uploader.upload(
            io.BytesIO(file_bytes),
            public_id=public_id,
            resource_type=resource_type,
            overwrite=False,
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"File upload failed: {str(e)}",
        )
    return result["secure_url"]


def _delete_file(file_url: str) -> None:
    """Delete a file from Cloudinary by its secure URL. Silently ignores errors."""
    try:
        after_upload = file_url.split("/upload/", 1)[1]
        if after_upload.startswith("v") and "/" in after_upload:
            after_upload = after_upload.split("/", 1)[1]
        public_id, _ = os.path.splitext(after_upload)

        if "/video/upload/" in file_url:
            resource_type = "video"
        elif "/image/upload/" in file_url:
            resource_type = "image"
        else:
            resource_type = "raw"

        cloudinary.uploader.destroy(public_id, resource_type=resource_type)
    except Exception:
        pass  # silently ignore missing or malformed URLs
