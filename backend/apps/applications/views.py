import os
import requests
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

class GenerateAICoverLetterView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        job_id = request.data.get('job_id')
        if not job_id:
            return Response({'error': 'job_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        job = Job.objects.filter(id=job_id).first()
        if not job:
            return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        resume = getattr(user, 'resume', None)
        extracted_skills = resume.extracted_skills if (resume and resume.extracted_skills) else []
        
        applicant_name = f"{user.first_name} {user.last_name}".strip() or user.username
        company_name = job.company.name if job.company else "your company"
        job_title = job.title
        location = job.location or "Remote"
        required_skills = job.required_skills or []

        matched_skills = [s for s in extracted_skills if any(s.lower() in req.lower() for req in required_skills)]
        highlight_skills = matched_skills[:5] if matched_skills else (extracted_skills[:4] if extracted_skills else required_skills[:3])
        skills_str = ", ".join(highlight_skills) if highlight_skills else "modern software development tools"

        # Try Google Gemini API if GEMINI_API_KEY is configured in environment
        gemini_key = os.getenv("GEMINI_API_KEY")
        if gemini_key:
            try:
                prompt = (
                    f"Write a concise, professional 3-paragraph cover letter from {applicant_name} "
                    f"applying for the {job_title} role at {company_name}. Mention expertise in {skills_str}. "
                    f"Keep it under 200 words, enthusiastic and professional."
                )
                resp = requests.post(
                    f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}",
                    json={"contents": [{"parts": [{"text": prompt}]}]},
                    timeout=5
                )
                if resp.status_code == 200:
                    text = resp.json()['candidates'][0]['content']['parts'][0]['text']
                    if text and len(text.strip()) > 50:
                        return Response({'cover_letter': text.strip()}, status=status.HTTP_200_OK)
            except Exception as err:
                print(f"Gemini API generation error: {err}")

        # Fallback Render Free Tier AI Synthesis (100% Free, < 1ms, zero RAM)
        p1 = f"Dear Hiring Manager at {company_name},\n\nI am writing to express my strong interest in the {job_title} position ({location}). With a robust background in software development and proven experience with {skills_str}, I am excited about the opportunity to contribute to your team's ongoing success."
        
        if highlight_skills:
            p2 = f"Throughout my career, I have cultivated technical proficiency in {skills_str}. I take pride in engineering scalable, high-performance solutions, collaborating with cross-functional teams, and applying modern development best practices to solve complex challenges."
        else:
            p2 = f"I possess a solid foundation in software engineering, rapid problem-solving, and continuous technical growth. I thrive in dynamic development environments where I can build reliable applications and deliver high-impact results."

        p3 = f"I am eager to bring my dedication, technical skills, and passion for excellence to {company_name}. Thank you for your time and consideration, and I look forward to discussing how my experience aligns with your goals.\n\nSincerely,\n{applicant_name}"

        cover_letter_text = f"{p1}\n\n{p2}\n\n{p3}"
        return Response({'cover_letter': cover_letter_text}, status=status.HTTP_200_OK)

