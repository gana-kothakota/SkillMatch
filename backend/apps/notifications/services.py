from .models import Notification

def create_notification(user, title, message, notification_type='SYSTEM'):
    """Utility service for triggering persistent user notifications."""
    if not user:
        return None
    return Notification.objects.create(
        user=user,
        title=title,
        message=message,
        notification_type=notification_type
    )
