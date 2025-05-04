from django.urls import path
from .views import PredictView, PredictionDetailView, ExplanationDetailView, RecommendationListView, RecommendationFeedbackView, PredictionListView


urlpatterns = [
    # POST
    path('', PredictView.as_view(), name='predict'),

    # List endpoints
    path('latest/', PredictionListView.as_view(), {'latest': 1}, name='prediction-latest'),
    path('all/', PredictionListView.as_view(), name='prediction-list'),

    # Feedback
    path('<int:prediction_pk>/recommendations/<int:rec_pk>/feedback/', RecommendationFeedbackView.as_view(), name='recommendation-feedback'),

    # GET detail/extras
    path('<int:pk>/', PredictionDetailView.as_view(), name='prediction-detail'),
    path('<int:pk>/explanation/', ExplanationDetailView.as_view(), name='prediction-explanation'),
    path('<int:pk>/recommendations/', RecommendationListView.as_view(), name='prediction-recommendations'),
]