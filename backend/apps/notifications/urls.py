from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificationViewSet, MarkAllReadView

router = DefaultRouter()
router.register(r'', NotificationViewSet, basename='notification')

urlpatterns = [
    path('mark-all-read/', MarkAllReadView.as_view(), name='notification-mark-all-read'),
    path('', include(router.urls)),
]
