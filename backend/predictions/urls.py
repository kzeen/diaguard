from django.urls import path
from .views import PredictView, PredictionDetailView, ExplanationDetailView, RecommendationListView

urlpatterns = [
    # POST
    path('', PredictView.as_view(), name='predict'),
    # GETs
    path('<int:pk>/', PredictionDetailView.as_view(), name='prediction-detail'),
    path('<int:pk>/explanation/', ExplanationDetailView.as_view(), name='prediction-explanation'),
    path('<int:pk>/recommendations/', RecommendationListView.as_view(), name='prediction-recommendations'),
]