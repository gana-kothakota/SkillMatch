from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from apps.resume.models import Resume

User = get_user_model()

class ResumeTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.applicant = User.objects.create_user(
            email='resume_app@example.com',
            username='resume_app',
            password='Password123!',
            role='APPLICANT'
        )

    def test_resume_not_found(self):
        self.client.force_authenticate(user=self.applicant)
        url = reverse('resume-detail')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_resume_creation_and_retrieval(self):
        resume = Resume.objects.create(
            user=self.applicant,
            file_name='test_resume.pdf',
            extracted_skills=['Python', 'Django', 'React'],
            raw_text='Test applicant skills Python Django React'
        )
        self.client.force_authenticate(user=self.applicant)
        url = reverse('resume-detail')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['file_name'], 'test_resume.pdf')
        self.assertIn('Python', response.data['extracted_skills'])

    def test_skill_extraction_utility(self):
        from apps.resume.utils import extract_text_and_skills_from_pdf, SKILL_DEFINITIONS
        import io

        dummy_text = "Experienced Developer skilled in Python, Django, React.js, C++, .NET, and AWS Cloud."
        dummy_file = io.BytesIO(dummy_text.encode('utf-8'))

        raw_text, skills = extract_text_and_skills_from_pdf(dummy_file)
        self.assertIn('Python', skills)
        self.assertIn('Django', skills)
        self.assertIn('React', skills)
        self.assertIn('C++', skills)
        self.assertIn('.NET', skills)
        self.assertIn('AWS', skills)
