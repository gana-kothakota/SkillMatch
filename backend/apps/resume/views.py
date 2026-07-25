from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Resume
from .serializers import ResumeSerializer
from .utils import extract_text_and_skills_from_pdf
from apps.accounts.permissions import IsApplicant

class ResumeDetailView(APIView):
    permission_classes = [IsAuthenticated, IsApplicant]

    def get(self, request):
        try:
            resume = request.user.resume
            serializer = ResumeSerializer(resume, context={'request': request})
            return Response(serializer.data)
        except Resume.DoesNotExist:
            return Response({'message': 'No resume uploaded yet'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request):
        try:
            resume = request.user.resume
            resume.delete()
            return Response({'message': 'Resume deleted successfully'}, status=status.HTTP_200_OK)
        except Resume.DoesNotExist:
            return Response({'error': 'No resume found to delete'}, status=status.HTTP_404_NOT_FOUND)

class ResumeUploadView(APIView):
    permission_classes = [IsAuthenticated, IsApplicant]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        file_obj = request.FILES.get('resume_pdf')
        if not file_obj:
            return Response({'error': 'No resume_pdf file provided'}, status=status.HTTP_400_BAD_REQUEST)

        if not file_obj.name.endswith('.pdf'):
            return Response({'error': 'Only PDF files are supported'}, status=status.HTTP_400_BAD_REQUEST)

        raw_text, extracted_skills = extract_text_and_skills_from_pdf(file_obj)

        resume, created = Resume.objects.get_or_create(user=request.user)
        resume.resume_pdf = file_obj
        resume.file_name = file_obj.name
        resume.extracted_skills = extracted_skills
        resume.raw_text = raw_text
        resume.save()

        serializer = ResumeSerializer(resume, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
