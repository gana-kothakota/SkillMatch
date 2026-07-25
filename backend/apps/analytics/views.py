from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .services import get_applicant_analytics, get_recruiter_analytics, get_admin_analytics
from apps.accounts.permissions import IsAdminRole, IsRecruiter, IsApplicant

class ApplicantAnalyticsView(APIView):
    permission_classes = [IsAuthenticated, IsApplicant]

    def get(self, request):
        data = get_applicant_analytics(request.user)
        return Response(data)

class RecruiterAnalyticsView(APIView):
    permission_classes = [IsAuthenticated, IsRecruiter]

    def get(self, request):
        data = get_recruiter_analytics(request.user)
        return Response(data)

class AdminAnalyticsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        data = get_admin_analytics()
        return Response(data)
