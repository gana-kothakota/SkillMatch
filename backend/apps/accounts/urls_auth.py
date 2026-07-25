from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView,
    RegisterView,
    GoogleOAuthView,
    LogoutView,
    PasswordResetView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='auth_login'),
    path('google/', GoogleOAuthView.as_view(), name='auth_google'),
    path('refresh/', TokenRefreshView.as_view(), name='auth_refresh'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('password-reset/', PasswordResetView.as_view(), name='auth_password_reset'),
]
