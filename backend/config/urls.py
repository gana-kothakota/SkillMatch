from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API Schema and Docs
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # API Endpoints
    path('api/v1/auth/', include('apps.accounts.urls_auth')),
    path('api/v1/users/', include('apps.accounts.urls_users')),
    path('api/v1/companies/', include('apps.companies.urls')),
    path('api/v1/jobs/', include('apps.jobs.urls')),
    path('api/v1/saved-jobs/', include('apps.jobs.urls_saved')),
    path('api/v1/applications/', include('apps.applications.urls')),
    path('api/v1/resumes/', include('apps.resume.urls')),
    path('api/v1/notifications/', include('apps.notifications.urls')),
    path('api/v1/analytics/', include('apps.analytics.urls')),
    path('api/v1/search/', include('apps.core.urls_search')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
