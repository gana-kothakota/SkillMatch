from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Application
from .serializers import ApplicationSerializer, ApplicationStatusSerializer
from apps.jobs.models import Job
from apps.resume.models import Resume
from apps.core.ai_matcher import calculate_ai_match
from apps.notifications.services import create_notification

class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'RECRUITER':
            return Application.objects.filter(job__recruiter=user).select_related('job', 'user', 'resume')
        elif user.role == 'ADMIN':
            return Application.objects.all().select_related('job', 'user', 'resume')
        return Application.objects.filter(user=user).select_related('job', 'resume')

    def create(self, request, *args, **kwargs):
        job_id = request.data.get('job')
        if not job_id:
            return Response({'error': 'job ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        job = Job.objects.filter(id=job_id, is_active=True).first()
        if not job:
            return Response({'error': 'Job not found or inactive'}, status=status.HTTP_404_NOT_FOUND)

        if Application.objects.filter(user=request.user, job=job).exists():
            return Response({'error': 'You have already applied for this job'}, status=status.HTTP_400_BAD_REQUEST)

        # Get applicant active resume
        resume = getattr(request.user, 'resume', None)
        extracted_skills = resume.extracted_skills if resume else []

        ai_res = calculate_ai_match(extracted_skills, job.required_skills or [])
        ai_score = ai_res['score']
        ai_breakdown = ai_res

        application = Application.objects.create(
            user=request.user,
            job=job,
            resume=resume,
            cover_letter=request.data.get('cover_letter', ''),
            ai_match_score=ai_score,
            ai_breakdown=ai_breakdown
        )

        # Notify recruiter
        create_notification(
            user=job.recruiter,
            title=f"New Application for {job.title}",
            message=f"{request.user.username} submitted an application (AI Match: {ai_score}%).",
            notification_type='APPLICATION_UPDATE'
        )

        serializer = self.get_serializer(application)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ApplicationStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        application = Application.objects.filter(pk=pk).first()
        if not application:
            return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)

        # Ensure requester is the job recruiter or admin
        if request.user != application.job.recruiter and request.user.role != 'ADMIN':
            return Response({'error': 'Unauthorized to update this application'}, status=status.HTTP_403_FORBIDDEN)

        serializer = ApplicationStatusSerializer(application, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Send notification to applicant
        create_notification(
            user=application.user,
            title=f"Application Update: {application.job.title}",
            message=f"Your application status has been updated to '{application.get_status_display()}'.",
            notification_type='APPLICATION_UPDATE'
        )

        return Response(ApplicationSerializer(application, context={'request': request}).data)
