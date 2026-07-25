from django.contrib import admin
from .models import Resume

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('user', 'file_name', 'uploaded_at')
    search_fields = ('user__email', 'file_name', 'extracted_skills')
