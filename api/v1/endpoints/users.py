import uuid
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, UploadFile, status
from sqlalchemy.orm import Session

from dependencies import get_current_onboarded_user, get_db
from models.user import User
from schemas.user import (
    BecomeCreatorResponse,
    MessageResponse,
    UserChangePassword,
    UserPublicResponse,
    UserResponse,
    UserUpdateProfile,
)
from services.cloudinary_service import upload_image
from services.user import (
    become_creator,
    change_password,
    delete_my_account,
    get_my_profile,
    get_public_profile,
    update_profile,
)

router = APIRouter(prefix="/users", tags=["users"])


# ── GET OWN PROFILE ───────────────────────────────────────────────────────────

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_onboarded_user)):
    """Return the full profile of the currently authenticated user."""
    return get_my_profile(current_user)


# ── UPDATE OWN PROFILE ────────────────────────────────────────────────────────

@router.put("/me", response_model=UserResponse)
async def update_me(
    full_name: Optional[str] = Form(None),
    username: Optional[str] = Form(None),
    bio: Optional[str] = Form(None),
    avatar: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    Update editable profile fields. Send as multipart/form-data.
    Upload an image file in the `avatar` field to update the profile picture.
    Only fields included in the request will be changed.
    """
    fields: dict = {}
    if full_name is not None:
        fields["full_name"] = full_name
    if username is not None:
        fields["username"] = username
    if bio is not None:
        fields["bio"] = bio
    if avatar is not None:
        contents = await avatar.read()
        fields["avatar_url"] = upload_image(
            contents,
            content_type=avatar.content_type,
            folder="avatars",
            public_id=str(current_user.id),
        )

    data = UserUpdateProfile(**fields)
    return update_profile(db, current_user, data)


# ── CHANGE PASSWORD ───────────────────────────────────────────────────────────

@router.put("/me/password", response_model=MessageResponse)
def update_password(
    data: UserChangePassword,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """Change password by verifying the current one and providing a new one."""
    return change_password(db, current_user, data)


# ── BECOME A CREATOR ──────────────────────────────────────────────────────────

@router.post("/me/become-creator", response_model=BecomeCreatorResponse, status_code=status.HTTP_200_OK)
def upgrade_to_creator(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    Permanently upgrade a member account to a creator.
    This action cannot be undone. A hub will be created automatically.
    """
    updated_user = become_creator(db, current_user)
    return BecomeCreatorResponse(
        message="Your account has been upgraded to creator. Your hub is ready.",
        role=updated_user.role,
    )


# ── DELETE ACCOUNT ────────────────────────────────────────────────────────────

@router.delete("/me", response_model=MessageResponse, status_code=status.HTTP_200_OK)
def delete_account(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    Soft-delete the authenticated user's account.
    The account is marked inactive — data is retained for integrity.
    """
    return delete_my_account(db, current_user)


# ── GET PUBLIC PROFILE ────────────────────────────────────────────────────────

@router.get("/{user_id}", response_model=UserPublicResponse)
def get_user_profile(
    user_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_onboarded_user),
):
    """
    Fetch the public profile of any user by their ID.
    Only exposes non-sensitive fields. Requires authentication.
    """
    return get_public_profile(db, user_id)