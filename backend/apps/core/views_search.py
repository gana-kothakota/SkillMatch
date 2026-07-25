from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Q
from apps.jobs.models import Job
from apps.companies.models import Company
from apps.jobs.serializers import JobListSerializer
from apps.companies.serializers import CompanySerializer

class GlobalSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response({
                'query': '',
                'jobs': [],
                'companies': [],
                'skills': []
            })

        # Search Jobs
        jobs_qs = Job.objects.filter(
            Q(is_active=True) & (
                Q(title__icontains=query) | 
                Q(description__icontains=query) | 
                Q(location__icontains=query)
            )
        )[:5]

        # Search Companies
        companies_qs = Company.objects.filter(
            Q(name__icontains=query) | 
            Q(location__icontains=query) | 
            Q(description__icontains=query)
        )[:5]

        # Search Skills match in jobs
        skill_jobs_qs = Job.objects.filter(
            is_active=True,
            required_skills__icontains=query
        )[:5]

        return Response({
            'query': query,
            'jobs': JobListSerializer(jobs_qs, many=True, context={'request': request}).data,
            'companies': CompanySerializer(companies_qs, many=True, context={'request': request}).data,
            'matched_skill_jobs': JobListSerializer(skill_jobs_qs, many=True, context={'request': request}).data
        })
