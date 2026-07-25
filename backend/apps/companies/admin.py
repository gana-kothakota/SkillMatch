from django.contrib import admin
from .models import Company

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'website', 'created_by', 'created_at')
    search_fields = ('name', 'location', 'description')
    ordering = ('-created_at',)
