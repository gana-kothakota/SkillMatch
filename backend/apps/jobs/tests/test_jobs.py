from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from apps.companies.models import Company
from apps.jobs.models import Job

User = get_user_model()

class JobTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.recruiter = User.objects.create_user(
            email='rec@example.com',
            username='rec',
            password='Password123!',
            role='RECRUITER'
        )
        self.company = Company.objects.create(
            name='Test Co',
            location='NYC',
            description='Tech company',
            created_by=self.recruiter
        )
        self.job = Job.objects.create(
            title='Backend Engineer',
            company=self.company,
            recruiter=self.recruiter,
            description='Python dev needed',
            required_skills=['Python', 'Django']
        )

    def test_list_jobs(self):
        url = reverse('job-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data['results']), 1)

    def test_create_job_permission(self):
        url = reverse('job-list')
        payload = {
            'title': 'Frontend Engineer',
            'company_id': str(self.company.id),
            'description': 'React dev',
            'location': 'New York, NY',
            'required_skills': ['React']
        }
        # Unauthenticated request should fail
        res_anon = self.client.post(url, payload, format='json')
        self.assertEqual(res_anon.status_code, status.HTTP_401_UNAUTHORIZED)

        # Recruiter request should succeed
        self.client.force_authenticate(user=self.recruiter)
        res_rec = self.client.post(url, payload, format='json')
        self.assertEqual(res_rec.status_code, status.HTTP_201_CREATED)
