from django.urls import path
from .views import ResumeDetailView, ResumeUploadView

urlpatterns = [
    path('me/', ResumeDetailView.as_view(), name='resume-detail'),
    path('upload/', ResumeUploadView.as_view(), name='resume-upload'),
]
