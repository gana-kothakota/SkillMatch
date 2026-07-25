import django_filters
from django.db.models import Q
from .models import Job

class JobFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='filter_search')
    location = django_filters.CharFilter(field_name='location', lookup_expr='icontains')
    min_salary = django_filters.NumberFilter(field_name='salary_min', lookup_expr='gte')
    max_salary = django_filters.NumberFilter(field_name='salary_max', lookup_expr='lte')
    skill = django_filters.CharFilter(method='filter_skill')

    class Meta:
        model = Job
        fields = ['job_type', 'experience_level', 'location', 'company', 'is_active']

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value) |
            Q(description__icontains=value) |
            Q(location__icontains=value) |
            Q(company__name__icontains=value)
        )

    def filter_skill(self, queryset, name, value):
        return queryset.filter(required_skills__icontains=value)
