from rest_framework import viewsets, permissions
from .models import Company
from .serializers import CompanySerializer
from apps.accounts.permissions import IsRecruiter

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    search_fields = ['name', 'location', 'description']
    ordering_fields = ['name', 'created_at']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [IsRecruiter]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
