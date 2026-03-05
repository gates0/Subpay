# → app/crud/payment.py

import json
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from models.transaction import Transaction
from models.withdrawal import Withdrawal


# ── Transaction Lookups ───────────────────────────────────────────────────────

def get_transaction_by_reference(db: Session, reference: str) -> Transaction | None:
    return db.query(Transaction).filter(Transaction.reference == reference).first()


def get_transaction_by_id(db: Session, transaction_id: int) -> Transaction | None:
    return (
        db.query(Transaction)
        .options(joinedload(Transaction.plan), joinedload(Transaction.hub))
        .filter(Transaction.id == transaction_id)
        .first()
    )


def get_transactions_by_user(db: Session, user_id: int) -> list[Transaction]:
    return (
        db.query(Transaction)
        .options(joinedload(Transaction.plan), joinedload(Transaction.hub))
        .filter(Transaction.user_id == user_id)
        .order_by(Transaction.created_at.desc())
        .all()
    )


def get_transactions_by_hub(db: Session, hub_id: int) -> list[Transaction]:
    return (
        db.query(Transaction)
        .options(joinedload(Transaction.plan), joinedload(Transaction.user))
        .filter(Transaction.hub_id == hub_id)
        .order_by(Transaction.created_at.desc())
        .all()
    )


# ── Transaction Creation & Updates ────────────────────────────────────────────

def create_pending_transaction(
    db: Session,
    *,
    user_id: int,
    plan_id: int,
    hub_id: int,
    reference: str,
    amount: float,
    currency: str,
    provider: str = "paystack",
) -> Transaction:
    transaction = Transaction(
        user_id=user_id,
        plan_id=plan_id,
        hub_id=hub_id,
        reference=reference,
        amount=amount,
        currency=currency,
        status="pending",
        provider=provider,
    )
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction


def mark_transaction_success(
    db: Session,
    transaction: Transaction,
    subscription_id: int,
    provider_response: dict,
) -> Transaction:
    transaction.status          = "success"
    transaction.subscription_id = subscription_id
    transaction.provider_response = json.dumps(provider_response)
    db.commit()
    db.refresh(transaction)
    return transaction


def mark_transaction_failed(
    db: Session,
    transaction: Transaction,
    provider_response: dict,
) -> Transaction:
    transaction.status            = "failed"
    transaction.provider_response = json.dumps(provider_response)
    db.commit()
    db.refresh(transaction)
    return transaction


# ── Earnings Aggregations ─────────────────────────────────────────────────────

def get_total_earned(db: Session, hub_id: int) -> float:
    """Sum of all successful transaction amounts for a hub."""
    result = (
        db.query(func.sum(Transaction.amount))
        .filter(Transaction.hub_id == hub_id, Transaction.status == "success")
        .scalar()
    )
    return float(result or 0)


# ── Withdrawal Lookups ────────────────────────────────────────────────────────

def get_withdrawals_by_hub(db: Session, hub_id: int) -> list[Withdrawal]:
    return (
        db.query(Withdrawal)
        .filter(Withdrawal.hub_id == hub_id)
        .order_by(Withdrawal.created_at.desc())
        .all()
    )


def get_total_withdrawn(db: Session, hub_id: int) -> float:
    """Sum of all completed withdrawal amounts for a hub."""
    result = (
        db.query(func.sum(Withdrawal.amount))
        .filter(Withdrawal.hub_id == hub_id, Withdrawal.status == "completed")
        .scalar()
    )
    return float(result or 0)


# ── Withdrawal Creation ───────────────────────────────────────────────────────

def create_withdrawal_request(
    db: Session,
    *,
    creator_id: int,
    hub_id: int,
    amount: float,
    currency: str,
    bank_name: str,
    account_number: str,
    account_name: str,
) -> Withdrawal:
    withdrawal = Withdrawal(
        creator_id=creator_id,
        hub_id=hub_id,
        amount=amount,
        currency=currency,
        status="pending",
        bank_name=bank_name,
        account_number=account_number,
        account_name=account_name,
    )
    db.add(withdrawal)
    db.commit()
    db.refresh(withdrawal)
    return withdrawal