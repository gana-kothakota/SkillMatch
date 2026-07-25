from rest_framework import serializers
from .models import Resume

class ResumeSerializer(serializers.ModelSerializer):
    pdf_url = serializers.SerializerMethodField()

    class Meta:
        model = Resume
        fields = ['id', 'resume_pdf', 'pdf_url', 'file_name', 'extracted_skills', 'raw_text', 'uploaded_at']
        read_only_fields = ['id', 'file_name', 'extracted_skills', 'raw_text', 'uploaded_at']

    def get_pdf_url(self, obj):
        if obj.resume_pdf:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.resume_pdf.url)
            return obj.resume_pdf.url
        return None
