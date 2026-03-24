from fastapi import APIRouter


from api.v1.endpoints.auth import router as auth_router
from api.v1.endpoints.users import router as users_router
from api.v1.endpoints.hubs import router as hubs_router
from api.v1.endpoints.plans import router as plans_router
from api.v1.endpoints.subscriptions import router as subscriptions_router
from api.v1.endpoints.content import router as content_router
from api.v1.endpoints.payments import router as payments_router
from api.v1.endpoints.notifications import router as notifications_router
from api.v1.endpoints.explore import router as explore_router
from api.v1.endpoints.oauth import router as oauth_router
from api.v1.endpoints.onboarding import router as onboarding_router
from api.v1.endpoints.comments import router as comments_router
from api.v1.endpoints.saved_content import router as savedcontent_router
from api.v1.endpoints.content_engaagement import router as contentengagement_router

router = APIRouter()
router.include_router(auth_router)
router.include_router(onboarding_router)
router.include_router(users_router)
router.include_router(hubs_router)
router.include_router(plans_router)
router.include_router(subscriptions_router)
router.include_router(content_router)
router.include_router(payments_router)
router.include_router(notifications_router)
router.include_router(explore_router)
router.include_router(oauth_router)
router.include_router(comments_router)
router.include_router(savedcontent_router)
router.include_router(contentengagement_router)