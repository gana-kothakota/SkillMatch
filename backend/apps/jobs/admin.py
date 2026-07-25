from django.contrib import admin
from .models import Job, SavedJob

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'job_type', 'experience_level', 'is_active', 'created_at')
    list_filter = ('job_type', 'experience_level', 'is_active')
    search_fields = ('title', 'description', 'company__name', 'location')
    ordering = ('-created_at',)

@admin.register(SavedJob)
class SavedJobAdmin(admin.ModelAdmin):
    list_display = ('user', 'job', 'created_at')
    search_fields = ('user__email', 'job__title')
