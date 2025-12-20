from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        "message": "Organic Sabzi Wala API is Running",
        "documentation": "/api/docs/",
        "admin": "/admin/"
    })
