import uuid
from django.db import models
from django.conf import settings
from apps.jobs.models import Job
from apps.resume.models import Resume

class Application(models.Model):
    class Status(models.TextChoices):
        APPLIED = 'APPLIED', 'Applied'
        UNDER_REVIEW = 'UNDER_REVIEW', 'Under Review'
        INTERVIEW = 'INTERVIEW', 'Interview Scheduled'
        TECH_ROUND = 'TECH_ROUND', 'Technical Round'
        HR_ROUND = 'HR_ROUND', 'HR Round'
        OFFER = 'OFFER', 'Offer Extended'
        HIRED = 'HIRED', 'Hired'
        REJECTED = 'REJECTED', 'Rejected'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='applications')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    resume = models.ForeignKey(Resume, on_delete=models.SET_NULL, null=True, blank=True, related_name='applications')
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.APPLIED)
    cover_letter = models.TextField(blank=True, null=True)
    ai_match_score = models.FloatField(default=0.0)
    ai_breakdown = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'job')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} applied for {self.job.title}"
