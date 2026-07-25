import time
import logging

logger = logging.getLogger('apps')

class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()
        
        response = self.get_response(request)

        duration = round((time.time() - start_time) * 1000, 2)
        user = getattr(request, 'user', 'Anonymous')
        ip = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', 'Unknown'))
        
        logger.info(
            f"API Call: {request.method} {request.path} | Status: {response.status_code} | Duration: {duration}ms | IP: {ip} | User: {user}"
        )

        return response
