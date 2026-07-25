from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ApplicationViewSet, ApplicationStatusUpdateView

router = DefaultRouter()
router.register(r'', ApplicationViewSet, basename='application')

urlpatterns = [
    path('<uuid:pk>/status/', ApplicationStatusUpdateView.as_view(), name='application-status-update'),
    path('', include(router.urls)),
]
