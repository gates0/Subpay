# → app/services/plan.py

from sqlalchemy.orm import Session

from core.exceptions import (
    hub_not_found_exception,
    not_a_creator_exception,
    plan_has_subscribers_exception,
    plan_not_found_exception,
    plan_not_in_hub_exception,
)
from crud.hub import get_hub_by_creator_id
from crud.plan import (
    create_plan,
    delete_plan,
    get_active_plan_by_id,
    get_plan_by_id,
    get_plans_by_hub,
    plan_has_active_subscribers,
    toggle_plan,
    update_plan,
)
from models.plan import Plan
from models.user import User
from schemas.plan import PlanCreate, PlanUpdate


# ── Create a Plan ─────────────────────────────────────────────────────────────

def create_my_plan(db: Session, current_user: User, data: PlanCreate) -> Plan:
    _require_creator(current_user)
    hub = _get_creator_hub(db, current_user)
    return create_plan(db, hub_id=hub.id, data=data)


# ── List All Plans on Own Hub (creator view — includes inactive) ───────────────

def list_my_plans(db: Session, current_user: User) -> list[Plan]:
    _require_creator(current_user)
    hub = _get_creator_hub(db, current_user)
    return get_plans_by_hub(db, hub_id=hub.id, active_only=False)


# ── List Active Plans on Any Hub (public/member view) ─────────────────────────

def list_hub_plans(db: Session, hub_id: int) -> list[Plan]:
    # Returns only active plans — members should not see deactivated plans
    return get_plans_by_hub(db, hub_id=hub_id, active_only=True)


# ── Get a Single Plan on Own Hub ──────────────────────────────────────────────

def get_my_plan(db: Session, current_user: User, plan_id: int) -> Plan:
    _require_creator(current_user)
    hub = _get_creator_hub(db, current_user)
    plan = get_plan_by_id(db, plan_id)
    _validate_plan_belongs_to_hub(plan, hub.id)
    return plan


# ── Update a Plan ─────────────────────────────────────────────────────────────

def update_my_plan(db: Session, current_user: User, plan_id: int, data: PlanUpdate) -> Plan:
    _require_creator(current_user)
    hub = _get_creator_hub(db, current_user)
    plan = get_plan_by_id(db, plan_id)
    _validate_plan_belongs_to_hub(plan, hub.id)
    return update_plan(db, plan, data)


# ── Toggle a Plan Active / Inactive ──────────────────────────────────────────

def toggle_my_plan(db: Session, current_user: User, plan_id: int) -> Plan:
    _require_creator(current_user)
    hub = _get_creator_hub(db, current_user)
    plan = get_plan_by_id(db, plan_id)
    _validate_plan_belongs_to_hub(plan, hub.id)
    return toggle_plan(db, plan)


# ── Delete a Plan ─────────────────────────────────────────────────────────────

def delete_my_plan(db: Session, current_user: User, plan_id: int) -> dict:
    _require_creator(current_user)
    hub = _get_creator_hub(db, current_user)
    plan = get_plan_by_id(db, plan_id)
    _validate_plan_belongs_to_hub(plan, hub.id)

    # Block deletion if members are actively subscribed to this plan
    if plan_has_active_subscribers(db, plan_id):
        raise plan_has_subscribers_exception

    delete_plan(db, plan)
    return {"message": "Plan deleted successfully."}


# ── Private Helpers ───────────────────────────────────────────────────────────

def _require_creator(user: User) -> None:
    if user.role != "creator":
        raise not_a_creator_exception


def _get_creator_hub(db: Session, user: User):
    hub = get_hub_by_creator_id(db, user.id)
    if not hub:
        raise hub_not_found_exception
    return hub


def _validate_plan_belongs_to_hub(plan: Plan | None, hub_id: int) -> None:
    if not plan:
        raise plan_not_found_exception
    if plan.hub_id != hub_id:
        raise plan_not_in_hub_exception