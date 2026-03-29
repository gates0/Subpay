"""
Email service using fastapi-mail.

In development, point MAIL_SERVER to Mailtrap (https://mailtrap.io) to
capture outgoing emails without delivering them. In production, use
Resend, Postmark, SendGrid, or any SMTP provider.
"""
import logging

from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType

from config import settings

logger = logging.getLogger(__name__)

_mail_config = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)

_fm = FastMail(_mail_config)


async def send_verification_email(to_email: str, token: str) -> None:
    verify_url = f"{settings.APP_BASE_URL}/api/v1/auth/verify-email?token={token}"
    body = f"""
    <h2>Verify your email address</h2>
    <p>Click the link below to verify your account. This link expires in 24 hours.</p>
    <a href="{verify_url}" style="
        display:inline-block;padding:12px 24px;background:#4F46E5;
        color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;">
      Verify Email
    </a>
    <p>Or copy this URL into your browser:</p>
    <p>{verify_url}</p>
    <p>If you did not create an account, you can safely ignore this email.</p>
    """
    message = MessageSchema(
        subject="Verify your email address",
        recipients=[to_email],
        body=body,
        subtype=MessageType.html,
    )
    try:
        await _fm.send_message(message)
        logger.info("Verification email sent to %s", to_email)
    except Exception as exc:
        logger.error("Failed to send verification email to %s: %s", to_email, exc, exc_info=True)
        raise


async def send_password_reset_email(to_email: str, token: str) -> None:
    reset_url = f"{settings.APP_BASE_URL}/api/v1/auth/reset-password?token={token}"
    body = f"""
    <h2>Reset your password</h2>
    <p>Click the link below to set a new password. This link expires in 1 hour.</p>
    <a href="{reset_url}" style="
        display:inline-block;padding:12px 24px;background:#4F46E5;
        color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;">
      Reset Password
    </a>
    <p>Or copy this URL into your browser:</p>
    <p>{reset_url}</p>
    <p>If you did not request a password reset, you can safely ignore this email.</p>
    """
    message = MessageSchema(
        subject="Reset your password",
        recipients=[to_email],
        body=body,
        subtype=MessageType.html,
    )
    try:
        await _fm.send_message(message)
        logger.info("Password reset email sent to %s", to_email)
    except Exception as exc:
        logger.error("Failed to send password reset email to %s: %s", to_email, exc, exc_info=True)
        raise