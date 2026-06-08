"""
Email service using Resend (https://resend.com).

Resend uses HTTP — not SMTP — so it works on Render and any other host
that blocks outbound port 587/465.

Setup:
  1. Sign up at https://resend.com (free tier: 3,000 emails/month)
  2. Create an API key in the Resend dashboard
  3. Add RESEND_API_KEY=re_... to your Render environment variables
  4. Verify your sending domain in Resend (or use onboarding@resend.dev for testing)
  5. Set MAIL_FROM to an address on your verified domain
"""
import logging

import httpx

from config import settings

logger = logging.getLogger(__name__)

_RESEND_URL = "https://api.resend.com/emails"


async def _send(to_email: str, subject: str, html: str) -> None:
    headers = {
        "Authorization": f"Bearer {settings.RESEND_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "from": settings.MAIL_FROM,
        "to": [to_email],
        "subject": subject,
        "html": html,
    }
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.post(_RESEND_URL, json=payload, headers=headers)
        response.raise_for_status()


async def send_verification_email(to_email: str, token: str) -> None:
    verify_url = f"{settings.FRONTEND_BASE_URL}/verify-email?token={token}"
    html = f"""
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
    try:
        await _send(to_email, "Verify your email address", html)
        logger.info("Verification email sent to %s", to_email)
    except Exception as exc:
        logger.error("Failed to send verification email to %s: %s", to_email, exc, exc_info=True)


async def send_password_reset_email(to_email: str, token: str) -> None:
    reset_url = f"{settings.APP_BASE_URL}/api/v1/auth/reset-password?token={token}"
    html = f"""
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
    try:
        await _send(to_email, "Reset your password", html)
        logger.info("Password reset email sent to %s", to_email)
    except Exception as exc:
        logger.error("Failed to send password reset email to %s: %s", to_email, exc, exc_info=True)
