from rest_framework import serializers
from .models import Company

class CompanySerializer(serializers.ModelSerializer):
    logo_display = serializers.SerializerMethodField()
    job_count = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = [
            'id', 'name', 'logo', 'logo_url', 'logo_display',
            'website', 'location', 'description', 'created_by',
            'job_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

    def get_logo_display(self, obj):
        if obj.logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.logo.url)
            return obj.logo.url
        return obj.logo_url or f"https://api.dicebear.com/7.x/identicon/svg?seed={obj.name}"

    def get_job_count(self, obj):
        return obj.jobs.filter(is_active=True).count()
