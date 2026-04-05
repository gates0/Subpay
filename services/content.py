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
from crud.subscription import get_subscribers_by_hub
from crud.plan import get_plan_by_id, get_plans_by_hub
from crud.subscription import get_active_subscription
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

    # If a plan_id is provided, make sure that plan actually belongs to this hub
    if data.plan_id:
        plan = get_plan_by_id(db, data.plan_id)
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
    db: Session, current_user: User, plan_id: int, cumulative: bool = True
) -> list[Content]:
    _require_creator(current_user)
    hub = _get_creator_hub(db, current_user)
    plan = get_plan_by_id(db, plan_id)
    if not plan or plan.hub_id != hub.id:
        from core.exceptions import content_plan_not_on_hub_exception
        raise content_plan_not_on_hub_exception

    if cumulative:
        # Return content from this plan AND all lower-priced plans (i.e. what a
        # subscriber on this tier would actually see, excluding free/untagged content)
        plan_price = float(plan.price)
        hub_plans = get_plans_by_hub(db, hub_id=hub.id, active_only=False)
        accessible_ids = [p.id for p in hub_plans if float(p.price) <= plan_price]
        items = []
        for pid in accessible_ids:
            items.extend(get_contents_by_plan(db, hub_id=hub.id, plan_id=pid))
        # Pinned first, then newest first
        items.sort(key=lambda c: (not c.is_pinned, c.created_at), reverse=False)
    else:
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

    # If changing the plan gate, verify the new plan belongs to this hub
    if data.plan_id is not None:
        plan = get_plan_by_id(db, data.plan_id)
        if not plan or plan.hub_id != hub.id:
            raise content_plan_not_on_hub_exception

    return update_content(db, content, data)


# ── Creator: Delete Content ───────────────────────────────────────────────────

def delete_my_content(db: Session, current_user: User, content_id: int) -> dict:
    _require_creator(current_user)
    hub = _get_creator_hub(db, current_user)
    content = get_content_by_id(db, content_id)
    _validate_content_on_hub(content, hub.id)

    # Remove the physical file from disk if one exists
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

    # Everyone else must have an active subscription
    subscription = get_active_subscription(db, member_id=current_user.id, hub_id=hub_id)
    if not subscription:
        raise subscription_not_found_exception

    all_published = get_contents_by_hub(db, hub_id=hub_id, published_only=True)

    # Tier-based filter: subscriber can access free content + content gated to any
    # plan whose price is at or below their own plan's price (cumulative lower tiers).
    subscriber_plan = get_plan_by_id(db, subscription.plan_id)
    subscriber_price = float(subscriber_plan.price)
    hub_plans = get_plans_by_hub(db, hub_id=hub_id, active_only=False)
    accessible_plan_ids = {p.id for p in hub_plans if float(p.price) <= subscriber_price}

    items = [
        item for item in all_published
        if item.plan_id is None or item.plan_id in accessible_plan_ids
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

    subscription = get_active_subscription(db, member_id=current_user.id, hub_id=hub_id)
    if not subscription:
        raise subscription_not_found_exception

    # Tier-based gate: subscriber can access content from equal or lower-priced plans
    if content.plan_id is not None:
        content_plan = get_plan_by_id(db, content.plan_id)
        subscriber_plan = get_plan_by_id(db, subscription.plan_id)
        if float(content_plan.price) > float(subscriber_plan.price):
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
    # Derive the public_id from the URL:
    # e.g. https://res.cloudinary.com/<cloud>/video/upload/v.../content/video/<name>
    # public_id is everything after /upload/v<version>/ (without extension for image/video)
    try:
        # Split on "/upload/" and take the part after the version segment
        after_upload = file_url.split("/upload/", 1)[1]
        # Strip the version prefix (v1234567890/)
        if after_upload.startswith("v") and "/" in after_upload:
            after_upload = after_upload.split("/", 1)[1]
        # For image/video Cloudinary ignores the extension in public_id; strip it
        public_id, _ = os.path.splitext(after_upload)

        # Determine resource type from the URL path
        if "/video/upload/" in file_url:
            resource_type = "video"
        elif "/image/upload/" in file_url:
            resource_type = "image"
        else:
            resource_type = "raw"

        cloudinary.uploader.destroy(public_id, resource_type=resource_type)
    except Exception:
        pass  # silently ignore missing or malformed URLs