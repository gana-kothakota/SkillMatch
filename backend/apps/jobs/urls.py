from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JobViewSet, RecommendedJobsView

router = DefaultRouter()
router.register(r'', JobViewSet, basename='job')

urlpatterns = [
    path('recommended/', RecommendedJobsView.as_view(), name='recommended-jobs'),
    path('', include(router.urls)),
]
