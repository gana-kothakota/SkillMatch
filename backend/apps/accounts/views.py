import logging
from rest_framework import generics, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    CustomTokenObtainPairSerializer,
    ChangePasswordSerializer,
    PasswordResetSerializer
)
from .permissions import IsAdminRole

User = get_user_model()
security_logger = logging.getLogger('security')
logger = logging.getLogger('apps')

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            user_email = request.data.get('email')
            ip = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', 'Unknown'))
            security_logger.info(f"Successful login for user {user_email} from IP {ip}")
        else:
            user_email = request.data.get('email', 'Unknown')
            ip = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', 'Unknown'))
            security_logger.warning(f"Failed login attempt for user {user_email} from IP {ip}")
        return response

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        refresh = RefreshToken.for_user(user)
        user_data = UserSerializer(user, context={'request': request}).data

        logger.info(f"New user registered: {user.email} as {user.role}")

        return Response({
            'success': True,
            'message': 'Registration successful.',
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'user': user_data
        }, status=status.HTTP_201_CREATED)

class GoogleOAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        username = request.data.get('username') or (email.split('@')[0] if email else None)
        role = request.data.get('role', User.Role.APPLICANT)
        avatar_url = request.data.get('avatar_url', '')

        if not email:
            return Response({'error': 'Email is required for Google OAuth'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email=email).first()
        if not user:
            # Create user with strong hashed random password for OAuth users
            import secrets
            random_pass = secrets.token_urlsafe(16)
            user = User.objects.create_user(
                email=email,
                username=username or f"google_{secrets.token_hex(4)}",
                role=role,
                password=random_pass,
                avatar_url=avatar_url,
                is_verified=True
            )
            logger.info(f"Created new user via Google OAuth: {email}")

        refresh = RefreshToken.for_user(user)
        user_data = UserSerializer(user, context={'request': request}).data

        ip = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', 'Unknown'))
        security_logger.info(f"Google OAuth login successful for {user.email} from IP {ip}")

        return Response({
            'success': True,
            'message': 'Google OAuth login successful.',
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'user': user_data
        }, status=status.HTTP_200_OK)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
                security_logger.info(f"User {request.user.email} logged out successfully.")
                return Response({'success': True, 'message': 'Logged out successfully.'}, status=status.HTTP_200_OK)
            return Response({'error': 'Refresh token is required.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class PasswordResetView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        user = User.objects.filter(email=email).first()
        if user:
            logger.info(f"Password reset requested for {email}")
        return Response({
            'success': True,
            'message': 'If an account exists with this email, password reset instructions have been sent.'
        }, status=status.HTTP_200_OK)

class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-created_at')
    serializer_class = UserSerializer
    permission_classes = [IsAdminRole]
    search_fields = ['email', 'username', 'role']
    filterset_fields = ['role', 'is_verified', 'is_active']
