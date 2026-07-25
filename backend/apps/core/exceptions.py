import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger('apps')
security_logger = logging.getLogger('security')

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    request = context.get('request')
    view = context.get('view')

    if response is not None:
        custom_data = {
            'success': False,
            'status_code': response.status_code,
            'errors': response.data,
        }
        response.data = custom_data

        if response.status_code in (401, 403):
            ip = request.META.get('REMOTE_ADDR', 'Unknown') if request else 'Unknown'
            user = request.user if request and hasattr(request, 'user') else 'Anonymous'
            security_logger.warning(
                f"Unauthorized access attempt: {request.method} {request.path} | User: {user} | IP: {ip} | Status: {response.status_code}"
            )
    else:
        logger.exception(f"Unhandled exception in {view.__class__.__name__}: {exc}")
        custom_data = {
            'success': False,
            'status_code': status.HTTP_500_INTERNAL_SERVER_ERROR,
            'errors': {'detail': 'An unexpected internal server error occurred.'}
        }
        response = Response(custom_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return response
