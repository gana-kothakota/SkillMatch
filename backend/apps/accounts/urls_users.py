from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfileView, AdminUserViewSet

router = DefaultRouter()
router.register(r'admin-manage', AdminUserViewSet, basename='admin-users')

urlpatterns = [
    path('me/', ProfileView.as_view(), name='user_profile'),
    path('', include(router.urls)),
]
