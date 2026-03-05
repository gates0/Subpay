# → app/crud/notification.py

from typing import Optional

from sqlalchemy.orm import Session

from models.notification import Notification


# ── Lookups ───────────────────────────────────────────────────────────────────

def get_notification_by_id(db: Session, notification_id: int) -> Notification | None:
    return db.query(Notification).filter(Notification.id == notification_id).first()


def get_notifications_by_user(db: Session, user_id: int) -> list[Notification]:
    return (
        db.query(Notification)
        .filter(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .all()
    )


def get_unread_count(db: Session, user_id: int) -> int:
    return (
        db.query(Notification)
        .filter(Notification.user_id == user_id, Notification.is_read == False)
        .count()
    )


# ── Creation ──────────────────────────────────────────────────────────────────

def create_notification(
    db: Session,
    *,
    user_id: int,
    type: str,
    title: str,
    body: str,
    entity_type: Optional[str] = None,
    entity_id:   Optional[int] = None,
) -> Notification:
    notification = Notification(
        user_id=user_id,
        type=type,
        title=title,
        body=body,
        entity_type=entity_type,
        entity_id=entity_id,
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


# ── Updates ───────────────────────────────────────────────────────────────────

def mark_as_read(db: Session, notification: Notification) -> Notification:
    if not notification.is_read:
        notification.is_read = True
        db.commit()
        db.refresh(notification)
    return notification


def mark_all_as_read(db: Session, user_id: int) -> int:
    """Marks all unread notifications as read. Returns count of rows updated."""
    updated = (
        db.query(Notification)
        .filter(Notification.user_id == user_id, Notification.is_read == False)
        .update({"is_read": True})
    )
    db.commit()
    return updated


# ── Deletion ──────────────────────────────────────────────────────────────────

def delete_notification(db: Session, notification: Notification) -> None:
    db.delete(notification)
    db.commit()