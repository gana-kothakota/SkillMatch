from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.companies.models import Company
from apps.jobs.models import Job, SavedJob
from apps.applications.models import Application
from apps.resume.models import Resume
from apps.notifications.models import Notification

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds initial demo users, companies, jobs, applications, and resumes'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Seeding database with demo data...'))

        def get_or_create_demo_user(email, username, password, role, is_staff=False, is_superuser=False, **extra_fields):
            user = User.objects.filter(email=email).first() or User.objects.filter(username=username).first()
            if not user:
                user = User.objects.create_user(
                    email=email,
                    username=username,
                    password=password,
                    role=role,
                    is_staff=is_staff,
                    is_superuser=is_superuser,
                    **extra_fields
                )
            else:
                user.email = email
                user.username = username
                user.role = role
                user.is_staff = is_staff
                user.is_superuser = is_superuser
                for key, val in extra_fields.items():
                    setattr(user, key, val)
                user.set_password(password)
                user.save()
            return user

        # Create Admin
        admin = get_or_create_demo_user(
            email='admin@skillmatch.ai',
            username='admin',
            password='Admin123!',
            role=User.Role.ADMIN,
            is_staff=True,
            is_superuser=True,
            is_verified=True,
            bio='System Administrator'
        )

        # Create Recruiter 1
        recruiter1 = get_or_create_demo_user(
            email='recruiter@techcorp.com',
            username='tech_recruiter',
            password='Recruiter123!',
            role=User.Role.RECRUITER,
            is_verified=True,
            bio='Senior Talent Acquisition Lead at TechCorp'
        )

        # Create Recruiter 2
        recruiter2 = get_or_create_demo_user(
            email='recruiter@innovate.io',
            username='innovate_recruiter',
            password='Recruiter123!',
            role=User.Role.RECRUITER,
            is_verified=True,
            bio='Head of Engineering Hiring at Innovate.io'
        )

        # Create Applicant
        applicant = get_or_create_demo_user(
            email='applicant@gmail.com',
            username='alex_dev',
            password='Applicant123!',
            role=User.Role.APPLICANT,
            first_name='Alex',
            last_name='Morgan',
            is_verified=True,
            bio='Full-Stack Software Engineer with 3+ years experience in React, Python, Django, and PostgreSQL.'
        )

        # Create Companies
        company1, _ = Company.objects.get_or_create(
            name='TechCorp Systems',
            defaults={
                'location': 'San Francisco, CA',
                'website': 'https://techcorp.example.com',
                'description': 'Leading provider of enterprise cloud infrastructure and AI solutions.',
                'created_by': recruiter1,
                'logo_url': 'https://api.dicebear.com/7.x/identicon/svg?seed=TechCorp'
            }
        )

        company2, _ = Company.objects.get_or_create(
            name='Innovate Labs',
            defaults={
                'location': 'New York, NY (Remote)',
                'website': 'https://innovate.example.io',
                'description': 'High-growth fintech startup building next-gen web & mobile financial platform.',
                'created_by': recruiter2,
                'logo_url': 'https://api.dicebear.com/7.x/identicon/svg?seed=Innovate'
            }
        )

        # Create Jobs
        job1, _ = Job.objects.get_or_create(
            title='Senior Full-Stack Engineer (React & Django)',
            company=company1,
            defaults={
                'recruiter': recruiter1,
                'description': 'We are looking for an experienced Full-Stack Engineer to lead development on our AI platform.',
                'job_type': Job.JobType.FULL_TIME,
                'experience_level': Job.ExperienceLevel.SENIOR,
                'salary_min': 120000,
                'salary_max': 160000,
                'location': 'San Francisco, CA (Hybrid)',
                'required_skills': ['React', 'Python', 'Django', 'PostgreSQL', 'Docker', 'REST API', 'Tailwind CSS'],
                'is_active': True
            }
        )

        job2, _ = Job.objects.get_or_create(
            title='Frontend Engineer (React 19 & TypeScript)',
            company=company2,
            defaults={
                'recruiter': recruiter2,
                'description': 'Join our high-performing frontend team building modern web apps with React, Vite, and Framer Motion.',
                'job_type': Job.JobType.REMOTE,
                'experience_level': Job.ExperienceLevel.MID,
                'salary_min': 95000,
                'salary_max': 130000,
                'location': 'Remote',
                'required_skills': ['React', 'TypeScript', 'Tailwind CSS', 'Redux', 'Git', 'HTML', 'CSS'],
                'is_active': True
            }
        )

        job3, _ = Job.objects.get_or_create(
            title='Backend Python / Django Developer',
            company=company1,
            defaults={
                'recruiter': recruiter1,
                'description': 'Seeking backend developer skilled in Python, Django REST Framework, PostgreSQL, and Redis.',
                'job_type': Job.JobType.FULL_TIME,
                'experience_level': Job.ExperienceLevel.MID,
                'salary_min': 100000,
                'salary_max': 140000,
                'location': 'San Francisco, CA',
                'required_skills': ['Python', 'Django', 'PostgreSQL', 'REST API', 'Redis', 'Docker'],
                'is_active': True
            }
        )

        # Create Applicant Resume
        resume, _ = Resume.objects.get_or_create(
            user=applicant,
            defaults={
                'file_name': 'Alex_Morgan_Resume.pdf',
                'extracted_skills': ['React', 'JavaScript', 'Python', 'Django', 'PostgreSQL', 'Tailwind CSS', 'Git', 'REST API'],
                'raw_text': 'Alex Morgan Software Engineer skills: React, Python, Django, PostgreSQL, Tailwind CSS, Git'
            }
        )

        # Create Saved Job
        SavedJob.objects.get_or_create(user=applicant, job=job2)

        # Create Sample Application
        app, app_created = Application.objects.get_or_create(
            user=applicant,
            job=job1,
            defaults={
                'resume': resume,
                'status': Application.Status.INTERVIEW,
                'cover_letter': 'I am thrilled to apply for the Senior Full-Stack position. I have 3+ years of hands-on experience building Django & React applications.',
                'ai_match_score': 87.5,
                'ai_breakdown': {
                    'score': 87.5,
                    'matched_skills': ['React', 'Python', 'Django', 'PostgreSQL', 'REST API', 'Tailwind CSS'],
                    'missing_skills': ['Docker'],
                    'recommendations': ['Strong fit! Your profile matches most required technical competencies. Consider adding Docker.']
                }
            }
        )

        # Create Notification
        Notification.objects.get_or_create(
            user=applicant,
            title='Application Status Update',
            message='Your application for Senior Full-Stack Engineer has progressed to Interview Scheduled stage.',
            defaults={'notification_type': 'APPLICATION_UPDATE', 'is_read': False}
        )

        self.stdout.write(self.style.SUCCESS('Database successfully seeded with demo data!'))
        self.stdout.write(self.style.WARNING(
            'Demo Accounts created:\n'
            ' - Admin: admin@skillmatch.ai / Admin123!\n'
            ' - Recruiter: recruiter@techcorp.com / Recruiter123!\n'
            ' - Applicant: applicant@gmail.com / Applicant123!\n'
        ))
