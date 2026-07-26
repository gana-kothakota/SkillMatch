from rest_framework import viewsets, permissions, generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Job, SavedJob
from .serializers import JobDetailSerializer, JobListSerializer, SavedJobSerializer
from .filters import JobFilter
from apps.accounts.permissions import IsRecruiter, IsApplicant, IsOwnerOrAdmin
from apps.core.ai_matcher import calculate_ai_match

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.filter(is_active=True)
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = JobFilter
    search_fields = ['title', 'description', 'location', 'company__name']
    ordering_fields = ['created_at', 'salary_min', 'title']

    def get_serializer_class(self):
        if self.action in ['list']:
            return JobListSerializer
        return JobDetailSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        elif self.action in ['create']:
            permission_classes = [IsRecruiter]
        else:
            permission_classes = [IsOwnerOrAdmin]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(recruiter=self.request.user)

class SavedJobViewSet(viewsets.ModelViewSet):
    serializer_class = SavedJobSerializer
    permission_classes = [IsAuthenticated, IsApplicant]

    def get_queryset(self):
        return SavedJob.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        job_id = request.data.get('job_id')
        if not job_id:
            return Response({'error': 'job_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        job = Job.objects.filter(id=job_id).first()
        if not job:
            return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

        saved_job, created = SavedJob.objects.get_or_create(user=request.user, job=job)
        if not created:
            return Response({'message': 'Job already saved'}, status=status.HTTP_200_OK)

        serializer = self.get_serializer(saved_job)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, pk=None, *args, **kwargs):
        # Allow deleting by either SavedJob ID or Job ID
        saved_job = SavedJob.objects.filter(user=request.user, job_id=pk).first() or \
                    SavedJob.objects.filter(user=request.user, id=pk).first()
        if not saved_job:
            return Response({'error': 'Saved job not found'}, status=status.HTTP_404_NOT_FOUND)
        saved_job.delete()
        return Response({'message': 'Job unsaved successfully'}, status=status.HTTP_200_OK)


class RecommendedJobsView(APIView):
    permission_classes = [IsAuthenticated, IsApplicant]

    def get(self, request):
        user = request.user
        resume_skills = getattr(user, 'resume', None)
        extracted_skills = resume_skills.extracted_skills if resume_skills else []

        active_jobs = Job.objects.filter(is_active=True).select_related('company')
        scored_jobs = []

        for job in active_jobs:
            match_data = calculate_ai_match(extracted_skills, job.required_skills or [])
            scored_jobs.append({
                'job': JobListSerializer(job, context={'request': request}).data,
                'ai_match': match_data
            })

        # Sort by AI Match score descending
        scored_jobs.sort(key=lambda x: x['ai_match']['score'], reverse=True)

        return Response(scored_jobs[:10])
