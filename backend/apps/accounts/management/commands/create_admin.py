from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates or updates a Superuser & Admin account'

    def add_arguments(self, parser):
        parser.add_argument('--email', type=str, default='admin@skillmatch.ai', help='Admin email address')
        parser.add_argument('--username', type=str, default='admin', help='Admin username')
        parser.add_argument('--password', type=str, default='Admin123!', help='Admin password')

    def handle(self, *args, **options):
        email = options['email']
        username = options['username']
        password = options['password']

        user = User.objects.filter(email=email).first() or User.objects.filter(username=username).first()

        if not user:
            user = User.objects.create_superuser(
                email=email,
                username=username,
                password=password,
                role=User.Role.ADMIN,
                is_staff=True,
                is_superuser=True,
                is_verified=True
            )
            self.stdout.write(self.style.SUCCESS(f"Successfully created Superuser & Admin account: {email}"))
        else:
            user.email = email
            user.username = username
            user.role = User.Role.ADMIN
            user.is_staff = True
            user.is_superuser = True
            user.is_verified = True
            user.set_password(password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f"Successfully updated existing user {email} to Superuser & Admin account!"))

        self.stdout.write(self.style.NOTICE(f"Credentials -> Email: {email} | Username: {username} | Password: {password}"))
