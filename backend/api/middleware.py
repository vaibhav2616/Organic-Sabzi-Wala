import logging
import traceback
import json
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from datetime import datetime

# Configure logging
logger = logging.getLogger('server_debug')
handler = logging.FileHandler('server_debug.log')
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)
logger.setLevel(logging.ERROR)

class GlobalErrorHandlerMiddleware(MiddlewareMixin):
    def process_exception(self, request, exception):
        # Log the error
        user_id = request.user.id if request.user.is_authenticated else 'Anonymous'
        error_hash = hash(str(exception))  # Simple hash for reference
        
        log_message = (
            f"User ID: {user_id}\n"
            f"Path: {request.path}\n"
            f"Method: {request.method}\n"
            f"Error Hash: {error_hash}\n"
            f"Exception: {str(exception)}\n"
            f"Traceback:\n{traceback.format_exc()}"
        )
        
        logger.error(log_message)

        # Return JSON response
        response_data = {
            'success': False,
            'user_msg': 'Something went wrong. Please try again later.',
            'debug_id': str(error_hash)
        }
        
        return JsonResponse(response_data, status=500)
