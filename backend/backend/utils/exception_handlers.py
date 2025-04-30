import logging
from rest_framework.views import exception_handler

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    """
    Wrap DRF’s exception_handler, then log uncaught exceptions.
    Returns an appropriate Response.
    """
    # 1. Let DRF build the default response
    response = exception_handler(exc, context)

    if response is None:
        # 2. If DRF did not handle it, it’s a 500 error
        logger.error(
            "Unhandled exception in %s: %s",
            context.get('view'), exc, exc_info=True
        )
        # 3. Build a generic 500 response
        from rest_framework.response import Response
        from rest_framework import status
        response = Response(
            {'detail': 'Internal server error.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    else:
        # 4. For handled exceptions (4xx), log at WARNING
        logger.warning(
            "API exception in %s: %s",
            context.get('view'), exc, exc_info=False
        )

    return response
