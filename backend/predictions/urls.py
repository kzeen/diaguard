from django.urls import path
from django.http import JsonResponse

def temp_view(request):
    return JsonResponse({"message": "Predictions app working"})

urlpatterns = [
    path('', temp_view, name='predictions-home')
]