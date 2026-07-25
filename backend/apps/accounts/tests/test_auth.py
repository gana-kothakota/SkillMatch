from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()

class AuthTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('auth_register')
        self.login_url = reverse('auth_login')

    def test_register_user_success(self):
        payload = {
            'email': 'newuser@example.com',
            'username': 'newuser',
            'password': 'Password123!',
            'password_confirm': 'Password123!',
            'role': 'APPLICANT'
        }
        response = self.client.post(self.register_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertIn('access', response.data['tokens'])

    def test_login_user_success(self):
        user = User.objects.create_user(
            email='testlogin@example.com',
            username='testlogin',
            password='Password123!',
            role='APPLICANT'
        )
        payload = {
            'email': 'testlogin@example.com',
            'password': 'Password123!'
        }
        response = self.client.post(self.login_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
