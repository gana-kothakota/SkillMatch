from rest_framework import permissions
from .models import User

class IsApplicant(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == User.Role.APPLICANT)

class IsRecruiter(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in [User.Role.RECRUITER, User.Role.ADMIN])

class IsAdminRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.role == User.Role.ADMIN or request.user.is_superuser))

class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.role == User.Role.ADMIN or request.user.is_superuser:
            return True
        user_field = getattr(obj, 'user', getattr(obj, 'recruiter', None))
        return user_field == request.user
