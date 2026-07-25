import uuid
from django.db import models
from django.conf import settings

class Resume(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='resume')
    resume_pdf = models.FileField(upload_to='resumes/')
    file_name = models.CharField(max_length=255)
    extracted_skills = models.JSONField(default=list)
    raw_text = models.TextField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Resume for {self.user.email}"
