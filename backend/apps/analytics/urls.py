from django.urls import path
from .views import ApplicantAnalyticsView, RecruiterAnalyticsView, AdminAnalyticsView

urlpatterns = [
    path('applicant/', ApplicantAnalyticsView.as_view(), name='analytics-applicant'),
    path('recruiter/', RecruiterAnalyticsView.as_view(), name='analytics-recruiter'),
    path('admin/', AdminAnalyticsView.as_view(), name='analytics-admin'),
]
