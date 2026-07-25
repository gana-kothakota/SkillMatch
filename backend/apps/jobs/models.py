import uuid
from django.db import models
from django.conf import settings
from apps.companies.models import Company

class Job(models.Model):
    class JobType(models.TextChoices):
        FULL_TIME = 'FULL_TIME', 'Full Time'
        PART_TIME = 'PART_TIME', 'Part Time'
        CONTRACT = 'CONTRACT', 'Contract'
        REMOTE = 'REMOTE', 'Remote'
        HYBRID = 'HYBRID', 'Hybrid'

    class ExperienceLevel(models.TextChoices):
        ENTRY = 'ENTRY', 'Entry Level'
        MID = 'MID', 'Mid Level'
        SENIOR = 'SENIOR', 'Senior Level'
        LEAD = 'LEAD', 'Lead / Executive'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='jobs')
    recruiter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='posted_jobs'
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    job_type = models.CharField(max_length=20, choices=JobType.choices, default=JobType.FULL_TIME)
    experience_level = models.CharField(max_length=20, choices=ExperienceLevel.choices, default=ExperienceLevel.MID)
    salary_min = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    salary_currency = models.CharField(max_length=10, default='USD')
    location = models.CharField(max_length=255, default='Remote', blank=True)
    required_skills = models.JSONField(default=list, help_text="List of skill keywords, e.g. ['React', 'Python', 'Docker']")
    deadline = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} at {self.company.name}"

class SavedJob(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='saved_jobs')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='saved_by_users')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'job')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} saved {self.job.title}"
