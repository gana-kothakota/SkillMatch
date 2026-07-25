from rest_framework.routers import DefaultRouter
from .views import SavedJobViewSet

router = DefaultRouter()
router.register(r'', SavedJobViewSet, basename='saved-job')

urlpatterns = router.urls
