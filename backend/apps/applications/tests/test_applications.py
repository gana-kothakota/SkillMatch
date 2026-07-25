from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from apps.companies.models import Company
from apps.jobs.models import Job
from apps.resume.models import Resume
from apps.applications.models import Application

User = get_user_model()

class ApplicationTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.recruiter = User.objects.create_user(
            email='app_rec@example.com',
            username='app_rec',
            password='Password123!',
            role='RECRUITER'
        )
        self.applicant = User.objects.create_user(
            email='applicant_user@example.com',
            username='applicant_user',
            password='Password123!',
            role='APPLICANT'
        )
        self.company = Company.objects.create(
            name='Global Tech',
            location='Boston',
            description='Tech solutions',
            created_by=self.recruiter
        )
        self.job = Job.objects.create(
            title='Software Engineer',
            company=self.company,
            recruiter=self.recruiter,
            description='Django React required',
            required_skills=['Python', 'Django', 'React']
        )
        self.resume = Resume.objects.create(
            user=self.applicant,
            file_name='applicant_cv.pdf',
            extracted_skills=['Python', 'Django']
        )

    def test_apply_job_and_calculate_ai_score(self):
        self.client.force_authenticate(user=self.applicant)
        url = reverse('application-list')
        payload = {
            'job': str(self.job.id),
            'cover_letter': 'Excited to apply for Software Engineer!'
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertGreater(response.data['ai_match_score'], 0)

        # Test duplicate application prevention
        res_dup = self.client.post(url, payload, format='json')
        self.assertEqual(res_dup.status_code, status.HTTP_400_BAD_REQUEST)

    def test_status_update_by_recruiter(self):
        app = Application.objects.create(
            user=self.applicant,
            job=self.job,
            resume=self.resume,
            cover_letter='Cover letter text',
            ai_match_score=66.7
        )
        url = reverse('application-status-update', kwargs={'pk': app.id})
        payload = {'status': 'INTERVIEW'}

        # Applicant attempt to update status should fail
        self.client.force_authenticate(user=self.applicant)
        res_app = self.client.patch(url, payload, format='json')
        self.assertEqual(res_app.status_code, status.HTTP_403_FORBIDDEN)

        # Recruiter update status should succeed
        self.client.force_authenticate(user=self.recruiter)
        res_rec = self.client.patch(url, payload, format='json')
        self.assertEqual(res_rec.status_code, status.HTTP_200_OK)
        self.assertEqual(res_rec.data['status'], 'INTERVIEW')
