# → app/services/notification.py

from typing import Optional

from sqlalchemy.orm import Session

from core.exceptions import notification_not_found_exception, notification_not_owned_exception
from crud.notification import (
    create_notification,
    delete_notification,
    get_notification_by_id,
    get_notifications_by_user,
    get_unread_count,
    mark_all_as_read,
    mark_as_read,
)
from models.notification import Notification
from models.user import User
from schemas.notification import NotificationCountResponse, NotificationType


# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║  NOTIFY UTILITY                                                              ║
# ║                                                                              ║
# ║  This is the single function every other service imports to fire a           ║
# ║  notification. Keeping it here (not in crud/) means we can add side          ║
# ║  effects later (email, push, websocket) without touching any other file.     ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

def notify(
    db: Session,
    *,
    user_id: int,
    type: NotificationType,
    title: str,
    body: str,
    entity_type: Optional[str] = None,
    entity_id:   Optional[int] = None,
) -> Notification:
    """
    Create a notification for a user.

    Call this from any service whenever a meaningful event occurs.
    All arguments are keyword-only to prevent accidental ordering mistakes.

    Example usage in services/payment.py:
        from services.notification import notify, NotificationType

        notify(
            db,
            user_id=transaction.user_id,
            type=NotificationType.payment_success,
            title="Payment successful",
            body=f"You are now subscribed to {hub.name}.",
            entity_type="hub",
            entity_id=hub.id,
        )
    """
    return create_notification(
        db,
        user_id=user_id,
        type=type,
        title=title,
        body=body,
        entity_type=entity_type,
        entity_id=entity_id,
    )


# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║  TYPED HELPERS                                                               ║
# ║                                                                              ║
# ║  One function per notification type so callers never have to construct       ║
# ║  title/body strings themselves. All business copy lives here.                ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

def notify_payment_success(db: Session, *, user_id: int, hub_name: str, hub_id: int) -> None:
    notify(
        db,
        user_id=user_id,
        type=NotificationType.payment_success,
        title="Payment successful 🎉",
        body=f"You are now subscribed to {hub_name}. Enjoy the content!",
        entity_type="hub",
        entity_id=hub_id,
    )


def notify_payment_failed(db: Session, *, user_id: int, hub_name: str) -> None:
    notify(
        db,
        user_id=user_id,
        type=NotificationType.payment_failed,
        title="Payment failed",
        body=f"Your payment for {hub_name} was not successful. Please try again.",
        entity_type=None,
        entity_id=None,
    )


def notify_new_subscriber(
    db: Session, *, creator_id: int, subscriber_username: str, hub_id: int
) -> None:
    notify(
        db,
        user_id=creator_id,
        type=NotificationType.new_subscriber,
        title="New subscriber!",
        body=f"{subscriber_username} just subscribed to your hub.",
        entity_type="hub",
        entity_id=hub_id,
    )


def notify_subscriber_cancelled(
    db: Session, *, creator_id: int, subscriber_username: str, hub_id: int
) -> None:
    notify(
        db,
        user_id=creator_id,
        type=NotificationType.subscriber_cancelled,
        title="Subscriber cancelled",
        body=f"{subscriber_username} has cancelled their subscription to your hub.",
        entity_type="hub",
        entity_id=hub_id,
    )


def notify_new_content(
    db: Session,
    *,
    user_id: int,
    hub_name: str,
    content_title: str,
    hub_id: int,
    content_id: int,
) -> None:
    notify(
        db,
        user_id=user_id,
        type=NotificationType.new_content,
        title=f"New content on {hub_name}",
        body=f'"{content_title}" was just published.',
        entity_type="content",
        entity_id=content_id,
    )


def notify_subscription_expiring(
    db: Session, *, user_id: int, hub_name: str, days_left: int, hub_id: int
) -> None:
    notify(
        db,
        user_id=user_id,
        type=NotificationType.subscription_expiring,
        title="Subscription expiring soon",
        body=f"Your subscription to {hub_name} expires in {days_left} day{'s' if days_left != 1 else ''}.",
        entity_type="hub",
        entity_id=hub_id,
    )


def notify_subscription_cancelled(
    db: Session, *, user_id: int, hub_name: str, hub_id: int
) -> None:
    notify(
        db,
        user_id=user_id,
        type=NotificationType.subscription_cancelled,
        title="Subscription cancelled",
        body=f"Your subscription to {hub_name} has been cancelled.",
        entity_type="hub",
        entity_id=hub_id,
    )


def notify_withdrawal_update(
    db: Session, *, creator_id: int, status: str, amount: float, currency: str
) -> None:
    status_messages = {
        "processing": "Your withdrawal request is being processed.",
        "completed":  f"Your withdrawal of {currency} {amount:,.2f} has been completed.",
        "failed":     "Your withdrawal request could not be completed. Please contact support.",
    }
    notify(
        db,
        user_id=creator_id,
        type=NotificationType.withdrawal_update,
        title=f"Withdrawal {status}",
        body=status_messages.get(status, f"Your withdrawal status has changed to {status}."),
        entity_type=None,
        entity_id=None,
    )


# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║  ENDPOINT LOGIC                                                              ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

def list_my_notifications(db: Session, current_user: User) -> list[Notification]:
    return get_notifications_by_user(db, user_id=current_user.id)


def get_my_unread_count(db: Session, current_user: User) -> NotificationCountResponse:
    count = get_unread_count(db, user_id=current_user.id)
    return NotificationCountResponse(unread_count=count)


def read_notification(
    db: Session, current_user: User, notification_id: int
) -> Notification:
    notification = get_notification_by_id(db, notification_id)
    if not notification:
        raise notification_not_found_exception
    if notification.user_id != current_user.id:
        raise notification_not_owned_exception
    return mark_as_read(db, notification)


def read_all_notifications(db: Session, current_user: User) -> dict:
    updated = mark_all_as_read(db, user_id=current_user.id)
    return {"message": f"{updated} notification{'s' if updated != 1 else ''} marked as read."}


def remove_notification(
    db: Session, current_user: User, notification_id: int
) -> dict:
    notification = get_notification_by_id(db, notification_id)
    if not notification:
        raise notification_not_found_exception
    if notification.user_id != current_user.id:
        raise notification_not_owned_exception
    delete_notification(db, notification)
    return {"message": "Notification deleted."}