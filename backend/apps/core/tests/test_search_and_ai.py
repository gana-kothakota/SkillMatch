from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from apps.core.ai_matcher import calculate_ai_match, normalize_skill

class CoreEngineTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_normalize_skill(self):
        self.assertEqual(normalize_skill('React.js'), 'react')
        self.assertEqual(normalize_skill('Python3'), 'python3')
        self.assertEqual(normalize_skill('JS'), 'javascript')

    def test_ai_match_calculation(self):
        resume_skills = ['React', 'Python', 'Django', 'Tailwind CSS']
        job_skills = ['React', 'Python', 'Django', 'Docker']
        
        result = calculate_ai_match(resume_skills, job_skills)
        self.assertEqual(result['score'], 75.0)
        self.assertIn('React', result['matched_skills'])
        self.assertIn('Docker', result['missing_skills'])

    def test_global_search_api(self):
        url = reverse('global-search') + '?q=React'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('jobs', response.data)
        self.assertIn('companies', response.data)
        self.assertIn('matched_skill_jobs', response.data)
