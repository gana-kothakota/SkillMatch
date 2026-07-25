from rest_framework import serializers
from .models import Job, SavedJob
from apps.companies.models import Company
from apps.companies.serializers import CompanySerializer
from apps.core.ai_matcher import calculate_ai_match

class JobListSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)
    is_saved = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            'id', 'company', 'title', 'job_type', 'experience_level',
            'salary_min', 'salary_max', 'salary_currency', 'location',
            'required_skills', 'deadline', 'is_saved', 'created_at'
        ]

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return SavedJob.objects.filter(user=request.user, job=obj).exists()
        return False

class JobDetailSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)
    company_id = serializers.PrimaryKeyRelatedField(
        queryset=Company.objects.all(),
        write_only=True,
        required=False,
        allow_null=True
    )
    company_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    recruiter_name = serializers.CharField(source='recruiter.username', read_only=True)
    is_saved = serializers.SerializerMethodField()
    has_applied = serializers.SerializerMethodField()
    ai_match = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            'id', 'company', 'company_id', 'company_name', 'recruiter', 'recruiter_name', 'title',
            'description', 'job_type', 'experience_level', 'salary_min',
            'salary_max', 'salary_currency', 'location', 'required_skills',
            'deadline', 'is_active', 'is_saved', 'has_applied', 'ai_match',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'recruiter', 'created_at', 'updated_at']

    def create(self, validated_data):
        company_id = validated_data.pop('company_id', None)
        company_name = validated_data.pop('company_name', None)

        if company_id:
            company = company_id
        elif company_name:
            company, _ = Company.objects.get_or_create(
                name=company_name,
                defaults={
                    'description': f'{company_name} corporate portal.',
                    'location': validated_data.get('location', 'Remote')
                }
            )
        else:
            company = Company.objects.first()
            if not company:
                company = Company.objects.create(name='Enterprise Tech Corp', location='Remote', description='Enterprise Corporate Entity')

        validated_data['company'] = company
        return super().create(validated_data)

    def update(self, instance, validated_data):
        company_id = validated_data.pop('company_id', None)
        company_name = validated_data.pop('company_name', None)

        if company_id:
            validated_data['company'] = company_id
        elif company_name:
            company, _ = Company.objects.get_or_create(
                name=company_name,
                defaults={
                    'description': f'{company_name} corporate portal.',
                    'location': validated_data.get('location', 'Remote')
                }
            )
            validated_data['company'] = company

        return super().update(instance, validated_data)

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return SavedJob.objects.filter(user=request.user, job=obj).exists()
        return False

    def get_has_applied(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.applications.filter(user=request.user).exists()
        return False

    def get_ai_match(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated and hasattr(request.user, 'resume'):
            resume_skills = request.user.resume.extracted_skills or []
            return calculate_ai_match(resume_skills, obj.required_skills or [])
        return None

class SavedJobSerializer(serializers.ModelSerializer):
    job = JobListSerializer(read_only=True)

    class Meta:
        model = SavedJob
        fields = ['id', 'job', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']
