# → app/crud/plan.py

from sqlalchemy.orm import Session

from models.plan import Plan
from schemas.plan import PlanCreate, PlanUpdate


# ── Lookups ───────────────────────────────────────────────────────────────────

def get_plan_by_id(db: Session, plan_id: int) -> Plan | None:
    return db.query(Plan).filter(Plan.id == plan_id).first()


def get_plans_by_hub(db: Session, hub_id: int, active_only: bool = False) -> list[Plan]:
    query = db.query(Plan).filter(Plan.hub_id == hub_id)
    if active_only:
        query = query.filter(Plan.is_active == True)
    return query.order_by(Plan.created_at.asc()).all()


def get_active_plan_by_id(db: Session, plan_id: int) -> Plan | None:
    return db.query(Plan).filter(Plan.id == plan_id, Plan.is_active == True).first()


# ── Creation ──────────────────────────────────────────────────────────────────

def create_plan(db: Session, hub_id: int, data: PlanCreate) -> Plan:
    plan = Plan(
        hub_id=hub_id,
        name=data.name,
        description=data.description,
        price=data.price,
        currency=data.currency,
        billing_cycle=data.billing_cycle,
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan


# ── Updates ───────────────────────────────────────────────────────────────────

def update_plan(db: Session, plan: Plan, data: PlanUpdate) -> Plan:
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(plan, field, value)
    db.commit()
    db.refresh(plan)
    return plan


def toggle_plan(db: Session, plan: Plan) -> Plan:
    plan.is_active = not plan.is_active
    db.commit()
    db.refresh(plan)
    return plan


# ── Deletion ──────────────────────────────────────────────────────────────────

def delete_plan(db: Session, plan: Plan) -> None:
    db.delete(plan)
    db.commit()


# ── Checks ────────────────────────────────────────────────────────────────────

def plan_has_active_subscribers(db: Session, plan_id: int) -> bool:
    """Returns True if any member is actively subscribed to this plan."""
    from models.subscription import Subscription  # local import avoids circular dependency
    return (
        db.query(Subscription)
        .filter(
            Subscription.plan_id == plan_id,
            Subscription.status == "active",
        )
        .first()
    ) is not None