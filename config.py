from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

    # Core
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    OAUTH_CALLBACK_BASE_URL: str = "https://subpay.onrender.com"
    # APP_BASE_URL: str = "http://localhost:8002"
    APP_BASE_URL: str = "https://subpay.onrender.com"

    # Email (Resend — https://resend.com)
    RESEND_API_KEY: str
    MAIL_FROM: str  # must be on a domain verified in Resend

    # Google OAuth
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str

    # GitHub OAuth
    GITHUB_CLIENT_ID: str
    GITHUB_CLIENT_SECRET: str
    GITHUB_REDIRECT_URI: str

    FRONTEND_OAUTH_REDIRECT_URL: str = "https://kreavly.com/onboarding"
    FRONTEND_VERIFY_REDIRECT_URL: str = "https://kreavly.com/onboarding"

    # ── Paystack ──────────────────────────────────────────────────────────────
    PAYSTACK_SECRET_KEY: str = ""
    # Backend callback — Paystack redirects here after payment.
    # This endpoint verifies the payment then redirects to the frontend.
    PAYMENT_CALLBACK_URL: str = "https://subpay.onrender.com/api/v1/payments/callback"

    # Frontend pages to land on after the backend callback processes the result
    FRONTEND_PAYMENT_SUCCESS_URL: str = "http://localhost:3002/communities"
    FRONTEND_PAYMENT_FAILURE_URL: str = "http://localhost:3002/communities"

    # ── Cloudinary (media storage) ────────────────────────────────────────────
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    # ── Platform fee (optional — deduct before creator earnings) ─────────────
    # e.g. 0.10 = 10% platform cut. Set to 0.0 to disable.
    PLATFORM_FEE_PERCENTAGE: float = 0.0



settings = Settings()