# → app/services/paystack.py
#
# All Paystack API calls are isolated here.
# To swap to Stripe: create services/stripe.py with the same function
# signatures and update the import in services/payment.py. Nothing else changes.

import hashlib
import hmac
import uuid
import httpx

from config import settings
from core.exceptions import payment_provider_exception


PAYSTACK_BASE_URL = "https://api.paystack.co"


def _headers() -> dict:
    return {
        "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
        "Content-Type": "application/json",
    }


def generate_reference() -> str:
    """Generate a unique payment reference string."""
    return f"HUB-{uuid.uuid4().hex.upper()}"


async def initialize_transaction(
    *,
    email: str,
    amount_naira: float,
    reference: str,
    callback_url: str,
    metadata: dict,
) -> dict:
    """
    Call Paystack to create a new transaction.
    Returns the full Paystack response data dict on success.
    Raises payment_provider_exception on any failure.

    Paystack amount is in kobo (1 NGN = 100 kobo).
    """
    payload = {
        "email": email,
        "amount": int(amount_naira * 100),  # convert to kobo
        "reference": reference,
        "callback_url": callback_url,
        "metadata": metadata,
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{PAYSTACK_BASE_URL}/transaction/initialize",
                json=payload,
                headers=_headers(),
                timeout=10.0,
            )
            data = response.json()
        except httpx.RequestError:
            raise payment_provider_exception

    if not data.get("status"):
        raise payment_provider_exception

    return data["data"]  # { authorization_url, access_code, reference }


async def verify_transaction(reference: str) -> dict:
    """
    Ask Paystack to confirm whether a payment was successful.
    Returns the transaction data dict on success.
    Raises payment_provider_exception if verification fails.
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{PAYSTACK_BASE_URL}/transaction/verify/{reference}",
                headers=_headers(),
                timeout=10.0,
            )
            data = response.json()
        except httpx.RequestError:
            raise payment_provider_exception

    if not data.get("status"):
        raise payment_provider_exception

    return data["data"]  # { status, amount, reference, customer, ... }


def verify_webhook_signature(payload_bytes: bytes, signature_header: str) -> bool:
    """
    Validate that a webhook request genuinely came from Paystack.
    Paystack signs the raw request body with HMAC-SHA512 using your secret key.
    Always call this before processing any webhook event.
    """
    if not settings.PAYSTACK_SECRET_KEY:
        return False

    expected = hmac.new(
        settings.PAYSTACK_SECRET_KEY.encode("utf-8"),
        payload_bytes,
        hashlib.sha512,
    ).hexdigest()

    return hmac.compare_digest(expected, signature_header)