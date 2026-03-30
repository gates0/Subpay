# → app/api/v1/plans.py

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from dependencies import get_current_active_user, get_db
from models.user import User
from schemas.content import ContentResponse
from schemas.plan import PlanCreate, PlanResponse, PlanUpdate
from schemas.user import MessageResponse
from services.content import list_my_plan_content
from services.plan import (
    create_my_plan,
    delete_my_plan,
    get_my_plan,
    list_hub_plans,
    list_my_plans,
    toggle_my_plan,
    update_my_plan,
)

router = APIRouter(tags=["plans"])


# ── CREATE A PLAN ─────────────────────────────────────────────────────────────

@router.post(
    "/hubs/me/plans",
    response_model=PlanResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_plan(
    data: PlanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Create a new subscription plan on the authenticated creator's hub.
    Creators can have multiple plans at different price points.
    """
    return create_my_plan(db, current_user, data)


# ── LIST OWN PLANS (creator view — includes inactive) ────────────────────────

@router.get("/hubs/me/plans", response_model=list[PlanResponse])
def list_my_plans_route(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    List all plans on the creator's own hub, including inactive ones.
    Members use GET /hubs/{hub_id}/plans instead, which only shows active plans.
    """
    return list_my_plans(db, current_user)


# ── GET A SINGLE PLAN ON OWN HUB ─────────────────────────────────────────────

@router.get("/hubs/me/plans/{plan_id}", response_model=PlanResponse)
def get_my_plan_route(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Fetch a specific plan from the creator's own hub by plan ID."""
    return get_my_plan(db, current_user, plan_id)


# ── UPDATE A PLAN ─────────────────────────────────────────────────────────────

@router.put("/hubs/me/plans/{plan_id}", response_model=PlanResponse)
def update_plan(
    plan_id: int,
    data: PlanUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Update a plan's details (name, description, price, currency, billing cycle).
    Only fields included in the request body will be changed.
    """
    return update_my_plan(db, current_user, plan_id, data)


# ── TOGGLE A PLAN ACTIVE / INACTIVE ──────────────────────────────────────────

@router.patch("/hubs/me/plans/{plan_id}/toggle", response_model=PlanResponse)
def toggle_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Toggle a plan between active and inactive.
    Inactive plans are hidden from members and cannot be subscribed to.
    """
    return toggle_my_plan(db, current_user, plan_id)


# ── DELETE A PLAN ─────────────────────────────────────────────────────────────

@router.delete("/hubs/me/plans/{plan_id}", response_model=MessageResponse)
def delete_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Permanently delete a plan.
    Will be blocked if any members are actively subscribed to it.
    """
    return delete_my_plan(db, current_user, plan_id)


# ── LIST CONTENT ON A SPECIFIC PLAN (creator view) ───────────────────────────

@router.get("/hubs/me/plans/{plan_id}/content", response_model=list[ContentResponse])
def list_plan_content(
    plan_id: int,
    cumulative: bool = Query(True, description="If false, return only content explicitly tagged to this plan"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    List all content (including drafts) gated to a specific plan on the creator's hub.

    - `cumulative=false` (default) → only content explicitly tagged to this plan.
    - `cumulative=true` → this plan's content **plus** all lower-tier (cheaper) plans' content,
      reflecting exactly what a subscriber on this tier would be able to access.
    """
    return list_my_plan_content(db, current_user, plan_id, cumulative)


# ── LIST ACTIVE PLANS ON ANY HUB (public/member view) ────────────────────────

@router.get("/hubs/{hub_id}/plans", response_model=list[PlanResponse])
def list_hub_plans_route(
    hub_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    List all active plans on any hub.
    Used by members browsing a hub to choose a subscription.
    Inactive plans are excluded.
    """
    return list_hub_plans(db, hub_id)