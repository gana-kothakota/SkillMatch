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

    def test_create_superuser_success(self):
        superuser = User.objects.create_superuser(
            email='admin_test@example.com',
            username='admin_test',
            password='AdminPassword123!'
        )
        self.assertTrue(superuser.is_superuser)
        self.assertTrue(superuser.is_staff)
        self.assertEqual(superuser.role, User.Role.ADMIN)

    def test_create_admin_management_command(self):
        from django.core.management import call_command
        call_command('create_admin', email='cmd_admin@example.com', username='cmd_admin', password='CmdAdmin123!')
        admin_user = User.objects.get(email='cmd_admin@example.com')
        self.assertTrue(admin_user.is_superuser)
        self.assertTrue(admin_user.is_staff)
        self.assertEqual(admin_user.role, User.Role.ADMIN)

    def test_cannot_register_admin_via_api(self):
        payload = {
            'email': 'bad_admin@example.com',
            'username': 'bad_admin',
            'password': 'Password123!',
            'password_confirm': 'Password123!',
            'role': 'ADMIN'
        }
        response = self.client.post(self.register_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

