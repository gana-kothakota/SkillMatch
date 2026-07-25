from django.db.models import Count, Avg
from django.db.models.functions import TruncMonth
from django.contrib.auth import get_user_model
from apps.jobs.models import Job, SavedJob
from apps.applications.models import Application
from apps.companies.models import Company

User = get_user_model()

def get_applicant_analytics(user):
    applications = Application.objects.filter(user=user)
    total_applied = applications.count()
    saved_count = SavedJob.objects.filter(user=user).count()

    avg_ai_score = applications.aggregate(Avg('ai_match_score'))['ai_match_score__avg'] or 0.0

    status_counts = list(
        applications.values('status').annotate(count=Count('id'))
    )

    return {
        'total_applied': total_applied,
        'saved_jobs_count': saved_count,
        'average_ai_match': round(avg_ai_score, 1),
        'status_distribution': status_counts
    }

def get_recruiter_analytics(user):
    jobs = Job.objects.filter(recruiter=user)
    job_ids = jobs.values_list('id', flat=True)
    applications = Application.objects.filter(job_id__in=job_ids)

    total_posted_jobs = jobs.count()
    total_applications_received = applications.count()
    avg_ai_match = applications.aggregate(Avg('ai_match_score'))['ai_match_score__avg'] or 0.0

    # Applications per month
    monthly_apps = list(
        applications.annotate(month=TruncMonth('created_at'))
        .values('month')
        .annotate(count=Count('id'))
        .order_by('month')
    )
    monthly_data = [
        {'month': item['month'].strftime('%b %Y') if item['month'] else 'Unknown', 'applications': item['count']}
        for item in monthly_apps
    ]

    # Application status pipeline breakdown
    pipeline_breakdown = list(
        applications.values('status').annotate(count=Count('id'))
    )

    # Top required skills across posted jobs
    skills_map = {}
    for job in jobs:
        for skill in (job.required_skills or []):
            skills_map[skill] = skills_map.get(skill, 0) + 1

    top_skills = sorted([{'skill': k, 'count': v} for k, v in skills_map.items()], key=lambda x: x['count'], reverse=True)[:6]

    return {
        'total_posted_jobs': total_posted_jobs,
        'total_applications_received': total_applications_received,
        'average_candidate_match': round(avg_ai_match, 1),
        'monthly_applications': monthly_data,
        'hiring_pipeline': pipeline_breakdown,
        'top_demanded_skills': top_skills
    }

def get_admin_analytics():
    total_users = User.objects.count()
    applicants_count = User.objects.filter(role=User.Role.APPLICANT).count()
    recruiters_count = User.objects.filter(role=User.Role.RECRUITER).count()
    companies_count = Company.objects.count()
    active_jobs = Job.objects.filter(is_active=True).count()
    total_applications = Application.objects.count()

    return {
        'total_users': total_users,
        'applicants_count': applicants_count,
        'recruiters_count': recruiters_count,
        'companies_count': companies_count,
        'active_jobs': active_jobs,
        'total_applications': total_applications,
    }
