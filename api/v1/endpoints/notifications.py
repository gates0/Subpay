# → app/api/v1/notifications.py

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from dependencies import get_current_onboarded_user, get_db
from models.user import User
from schemas.notification import NotificationCountResponse, NotificationResponse
from schemas.user import MessageResponse
from services.notification import (
    get_my_unread_count,
    list_my_notifications,
    read_all_notifications,
    read_notification,
    remove_notification,
)

router = APIRouter(prefix="/notifications", tags=["notifications"])


# ── GET ALL NOTIFICATIONS ─────────────────────────────────────────────────────

@router.get("", response_model=list[NotificationResponse])
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    Fetch all notifications for the authenticated user, newest first.
    Includes both read and unread notifications.
    """
    return list_my_notifications(db, current_user)


# ── GET UNREAD COUNT ──────────────────────────────────────────────────────────

@router.get("/unread-count", response_model=NotificationCountResponse)
def unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    Return the count of unread notifications.
    Use this to drive the badge number on your frontend notification bell.
    """
    return get_my_unread_count(db, current_user)


# ── MARK ALL AS READ ──────────────────────────────────────────────────────────
# NOTE: This /read-all route is registered BEFORE /{notification_id} so
# FastAPI does not try to match "read-all" as an integer notification_id.

@router.patch("/read-all", response_model=MessageResponse)
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """Mark every unread notification as read in one call."""
    return read_all_notifications(db, current_user)


# ── MARK ONE AS READ ──────────────────────────────────────────────────────────

@router.patch("/{notification_id}/read", response_model=NotificationResponse)
def mark_one_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    Mark a single notification as read.
    Returns the updated notification object.
    Idempotent — marking an already-read notification is safe.
    """
    return read_notification(db, current_user, notification_id)


# ── DELETE A NOTIFICATION ─────────────────────────────────────────────────────

@router.delete("/{notification_id}", response_model=MessageResponse)
def delete_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """Permanently delete a single notification."""
    return remove_notification(db, current_user, notification_id)