import uuid

from sqlalchemy.orm import Session

from core.exceptions import (
    already_a_creator_exception,
    incorrect_password_exception,
    same_password_exception,
    user_not_found_exception,
    username_taken_exception,
)
from core.security import hash_password, verify_password
from crud.user import (
    deactivate_user,
    get_user_by_id,
    get_user_by_username,
    update_user_password,
    update_user_profile,
    upgrade_to_creator,
)
from models.user import User
from schemas.user import UserChangePassword, UserUpdateProfile


def get_my_profile(current_user: User) -> User:
    return current_user


def get_public_profile(db: Session, user_id: uuid.UUID) -> User:
    user = get_user_by_id(db, user_id)
    # Only surface users who are active AND have completed onboarding.
    # Un-onboarded users have no username/role and must not appear publicly.
    if not user or not user.is_active or not user.is_onboarded:
        raise user_not_found_exception
    return user


def update_profile(db: Session, current_user: User, data: UserUpdateProfile) -> User:
    if data.username and data.username != current_user.username:
        existing = get_user_by_username(db, data.username)
        if existing and existing.id != current_user.id:
            raise username_taken_exception
    return update_user_profile(db, current_user, data)


def change_password(db: Session, current_user: User, data: UserChangePassword) -> dict:
    if not verify_password(data.current_password, current_user.hashed_password):
        raise incorrect_password_exception
    if data.current_password == data.new_password:
        raise same_password_exception
    update_user_password(db, current_user, hash_password(data.new_password))
    return {"message": "Password updated successfully."}


def become_creator(db: Session, current_user: User) -> User:
    if current_user.role == "creator":
        raise already_a_creator_exception

    # 1. Permanently flip the role
    updated_user = upgrade_to_creator(db, current_user)

    # 2. Auto-create the hub — import here to avoid circular imports
    from services.hub import create_hub_for_user
    create_hub_for_user(db, updated_user)

    return updated_user


def delete_my_account(db: Session, current_user: User) -> dict:
    # Guard: block deletion if creator has active subscribers.
    # Wire this up once the subscriptions module is built:
    # if current_user.role == "creator" and has_active_subscribers(db, current_user.id):
    #     raise active_subscribers_exception
    deactivate_user(db, current_user)
    return {"message": "Account deactivated successfully."}