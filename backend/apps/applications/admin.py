from django.contrib import admin
from .models import Application

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('user', 'job', 'status', 'ai_match_score', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__email', 'job__title', 'job__company__name')
