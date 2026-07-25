from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()

class AnalyticsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.applicant = User.objects.create_user(
            email='an_app@example.com',
            username='an_app',
            password='Password123!',
            role='APPLICANT'
        )
        self.recruiter = User.objects.create_user(
            email='an_rec@example.com',
            username='an_rec',
            password='Password123!',
            role='RECRUITER'
        )
        self.admin = User.objects.create_superuser(
            email='an_admin@example.com',
            username='an_admin',
            password='Password123!',
            role='ADMIN'
        )

    def test_applicant_analytics_access(self):
        self.client.force_authenticate(user=self.applicant)
        url = reverse('analytics-applicant')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_applied', response.data)

    def test_recruiter_analytics_access(self):
        self.client.force_authenticate(user=self.recruiter)
        url = reverse('analytics-recruiter')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_posted_jobs', response.data)

    def test_admin_analytics_access(self):
        self.client.force_authenticate(user=self.admin)
        url = reverse('analytics-admin')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_users', response.data)
