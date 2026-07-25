from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from apps.companies.models import Company

User = get_user_model()

class CompaniesTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.recruiter = User.objects.create_user(
            email='rec@company.com',
            username='rec_company',
            password='Password123!',
            role='RECRUITER'
        )
        self.applicant = User.objects.create_user(
            email='app@company.com',
            username='app_company',
            password='Password123!',
            role='APPLICANT'
        )
        self.company = Company.objects.create(
            name='Acme Corp',
            location='San Francisco, CA',
            website='https://acme.example.com',
            description='Innovating widget creation',
            created_by=self.recruiter
        )

    def test_list_companies_public(self):
        url = reverse('company-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data['results']), 1)

    def test_create_company_permission(self):
        url = reverse('company-list')
        payload = {
            'name': 'New Tech Inc',
            'location': 'Seattle, WA',
            'description': 'Software enterprise'
        }
        # Applicant creation should fail
        self.client.force_authenticate(user=self.applicant)
        res_app = self.client.post(url, payload, format='json')
        self.assertEqual(res_app.status_code, status.HTTP_403_FORBIDDEN)

        # Recruiter creation should succeed
        self.client.force_authenticate(user=self.recruiter)
        res_rec = self.client.post(url, payload, format='json')
        self.assertEqual(res_rec.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res_rec.data['name'], 'New Tech Inc')
