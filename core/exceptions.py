from fastapi import HTTPException, status

# ── Auth Exceptions ───────────────────────────────────────────────────────────

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)

inactive_user_exception = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="Inactive user",
)

unverified_user_exception = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="Email address not verified. Please check your inbox.",
)

user_not_found_exception = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="User not found",
)

email_taken_exception = HTTPException(
    status_code=status.HTTP_409_CONFLICT,
    detail="Email already registered",
)

username_taken_exception = HTTPException(
    status_code=status.HTTP_409_CONFLICT,
    detail="Username already taken",
)

invalid_credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Incorrect email or password",
    headers={"WWW-Authenticate": "Bearer"},
)

invalid_token_exception = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="Invalid or expired token",
)

oauth_error_exception = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="OAuth authentication failed",
)

# ── User / Profile Exceptions ─────────────────────────────────────────────────

already_a_creator_exception = HTTPException(
    status_code=status.HTTP_409_CONFLICT,
    detail="Your account is already a creator",
)

incorrect_password_exception = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="Current password is incorrect",
)

same_password_exception = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="New password must be different from the current password",
)

forbidden_exception = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="You do not have permission to perform this action",
)

# ── Hub Exceptions ────────────────────────────────────────────────────────────

hub_not_found_exception = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Hub not found",
)

hub_inactive_exception = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="This hub is currently inactive",
)

not_a_creator_exception = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="You must be a creator to perform this action",
)

hub_already_exists_exception = HTTPException(
    status_code=status.HTTP_409_CONFLICT,
    detail="A hub already exists for this creator",
)

# ── Plan Exceptions ───────────────────────────────────────────────────────────

plan_not_found_exception = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Plan not found",
)

plan_not_in_hub_exception = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="This plan does not belong to your hub",
)

plan_has_subscribers_exception = HTTPException(
    status_code=status.HTTP_409_CONFLICT,
    detail="Cannot delete a plan with active subscribers. Deactivate it instead.",
)

# ── Subscription Exceptions ───────────────────────────────────────────────────

subscription_not_found_exception = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Subscription not found",
)

subscription_not_owned_exception = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="You do not have access to this subscription",
)

subscription_already_active_exception = HTTPException(
    status_code=status.HTTP_409_CONFLICT,
    detail="You already have an active subscription to this hub",
)

subscription_not_cancellable_exception = HTTPException(
    status_code=status.HTTP_409_CONFLICT,
    detail="Only active subscriptions can be cancelled",
)

subscriber_not_found_exception = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Subscriber not found on this hub",
)

cannot_subscribe_to_own_hub_exception = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="You cannot subscribe to your own hub",
)

# ── Content Exceptions ────────────────────────────────────────────────────────

content_not_found_exception = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Content not found",
)

content_access_denied_exception = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="Your current subscription plan does not include access to this content",
)

content_wrong_type_for_upload_exception = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="Invalid file type for the selected content type",
)

content_missing_text_body_exception = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="text_body is required for text content",
)

content_missing_file_exception = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="A file must be uploaded for video, image, and pdf content",
)

content_plan_not_on_hub_exception = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="The specified plan does not belong to your hub",
)

content_file_too_large_exception = HTTPException(
    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
    detail="File exceeds the maximum allowed size of 500 MB",
)

# ── Payment Exceptions ────────────────────────────────────────────────────────

payment_provider_exception = HTTPException(
    status_code=status.HTTP_502_BAD_GATEWAY,
    detail="Payment provider is unavailable. Please try again shortly.",
)

payment_reference_not_found_exception = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Payment reference not found",
)

payment_already_processed_exception = HTTPException(
    status_code=status.HTTP_409_CONFLICT,
    detail="This payment has already been processed successfully",
)

payment_failed_exception = HTTPException(
    status_code=status.HTTP_402_PAYMENT_REQUIRED,
    detail="Payment was not successful. Please try again.",
)

withdrawal_insufficient_balance_exception = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="Withdrawal amount exceeds your available balance",
)

# ── Notification Exceptions ───────────────────────────────────────────────────

notification_not_found_exception = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Notification not found",
)

notification_not_owned_exception = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="You do not have access to this notification",
)

# ── OAuth Exceptions ──────────────────────────────────────────────────────────

oauth_state_mismatch_exception = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="OAuth state mismatch. Possible CSRF attack. Please try again.",
)

oauth_missing_email_exception = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="OAuth provider did not return an email address. "
           "Please ensure your account has a public email.",
)

oauth_provider_not_supported_exception = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="Unsupported OAuth provider.",
)

# ── OAuth Registration Exceptions ─────────────────────────────────────────────

oauth_role_already_set_exception = HTTPException(
    status_code=status.HTTP_409_CONFLICT,
    detail="Role has already been set for this account",
)

oauth_role_selection_required_exception = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="Please complete your registration by selecting a role",
)

# ── Onboarding Exceptions ─────────────────────────────────────────────────────

onboarding_required_exception = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="Please complete onboarding at POST /onboarding/complete before using this endpoint.",
)

onboarding_already_complete_exception = HTTPException(
    status_code=status.HTTP_409_CONFLICT,
    detail="Onboarding has already been completed for this account.",
)

onboarding_username_taken_exception = HTTPException(
    status_code=status.HTTP_409_CONFLICT,
    detail="This username is already taken. Please choose another.",
)

# ── Comment Exceptions ────────────────────────────────────────────────────────

comment_not_found_exception = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Comment not found.",
)

comment_not_owned_exception = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="You do not have permission to modify this comment.",
)

comment_is_reply_exception = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="Replies cannot be nested. You can only reply to top-level comments.",
)

comment_access_denied_exception = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="This comment has been deleted and cannot be edited.",
)