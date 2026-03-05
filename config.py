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
    OAUTH_CALLBACK_BASE_URL: str = "http://localhost:8002"
    APP_BASE_URL: str = "http://localhost:8002"

    # Email
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_PORT: int = 587
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False

    # Google OAuth
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str

    # GitHub OAuth
    GITHUB_CLIENT_ID: str
    GITHUB_CLIENT_SECRET: str
    GITHUB_REDIRECT_URI: str

    # ── Paystack ──────────────────────────────────────────────────────────────
    PAYSTACK_SECRET_KEY: str = ""
    # URL Paystack redirects users to after payment.
    # Your frontend should call POST /payments/verify?reference=xxx on this page.
    PAYMENT_CALLBACK_URL: str = "http://localhost:3000/payment/callback"

    # ── Platform fee (optional — deduct before creator earnings) ─────────────
    # e.g. 0.10 = 10% platform cut. Set to 0.0 to disable.
    PLATFORM_FEE_PERCENTAGE: float = 0.0



settings = Settings()