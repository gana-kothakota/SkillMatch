from rest_framework import serializers
from .models import Application
from apps.jobs.serializers import JobListSerializer
from apps.accounts.serializers import UserSerializer
from apps.resume.serializers import ResumeSerializer

class ApplicationSerializer(serializers.ModelSerializer):
    job_details = JobListSerializer(source='job', read_only=True)
    applicant_details = UserSerializer(source='user', read_only=True)
    resume_details = ResumeSerializer(source='resume', read_only=True)

    class Meta:
        model = Application
        fields = [
            'id', 'user', 'job', 'job_details', 'applicant_details',
            'resume', 'resume_details', 'status', 'cover_letter',
            'ai_match_score', 'ai_breakdown', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'ai_match_score', 'ai_breakdown', 'created_at', 'updated_at']

class ApplicationStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['status']
