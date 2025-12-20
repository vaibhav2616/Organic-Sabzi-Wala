from rest_framework.renderers import JSONRenderer

class StandardResponseRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        response = renderer_context['response'] if renderer_context else None
        
        # If the view already structured the response, return as is (e.g. error handler)
        if isinstance(data, dict) and 'success' in data and 'user_msg' in data:
            return super().render(data, accepted_media_type, renderer_context)

        # Default standard envelope
        formatted_data = {
            'success': True if response and response.status_code < 400 else False,
            'data': data,
            'user_msg': 'Success' if response and response.status_code < 400 else 'Error',
            'debug_log': 'No errors detected' # Placeholder, actionable via middleware logic if needed
        }

        # Handle error details from DRF (e.g. serializer errors)
        if response and response.status_code >= 400:
            formatted_data['success'] = False
            formatted_data['user_msg'] = 'Validation Error' if response.status_code == 400 else 'Request Failed'
            # If data is a list or dict of errors, put it in debug_log or a specific errors field
            formatted_data['errors'] = data
            formatted_data['data'] = None

        return super().render(formatted_data, accepted_media_type, renderer_context)
