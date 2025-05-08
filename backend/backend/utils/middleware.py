import time
import logging

logger = logging.getLogger(__name__)

class RequestLoggingMiddleware:
    """
    Logs each request's path, method, status code, and duration.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start = time.time()           # 1. timestamp at entry
        response = self.get_response(request)
        duration = time.time() - start

        # 2. Log at INFO level
        logger.info(
            "%s %s %s %.3fsec",
            request.method,
            request.get_full_path(),
            response.status_code,
            duration
        )
        return response
