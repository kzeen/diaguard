from rest_framework import generics, permissions, authentication, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.throttling import UserRateThrottle
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Prediction, Recommendation
from .serializers import PredictionRequestSerializer, PredictionSerializer, ExplanationSerializer, RecommendationSerializer, RecommendationFeedbackSerializer

class PredictionsThrottle(UserRateThrottle):
    scope = 'predictions'

class FeedbackThrottle(UserRateThrottle):
    scope = 'feedback'

# POST /api/predictions/  (Create health input + prediction + ...)
class PredictView(generics.CreateAPIView):
    """
    Accepts raw health data, runs dummy (or real) ML inference,
    returns nested PredictionSerializer via PredictionRequestSerializer.
    """
    serializer_class = PredictionRequestSerializer
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [PredictionsThrottle]

    def perform_create(self, serializer):
        # Simply save; all main work in serializer.create()
        serializer.save()

# POST /api/predictions/{prediction_pk}/recommendations/{rec_pk}/feedback
class RecommendationFeedbackView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [FeedbackThrottle]

    def post(self, request, prediction_pk, rec_pk):
        prediction = get_object_or_404(Prediction, pk=prediction_pk)
        if prediction.health_input.user != request.user:
            return Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)
        
        recommendation = get_object_or_404(Recommendation, pk=rec_pk, prediction=prediction)

        serializer = RecommendationFeedbackSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        recommendation.helpful = serializer.validated_data['helpful']
        recommendation.feedback_at = timezone.now()
        recommendation.save()

        out = RecommendationSerializer(recommendation)
        return Response(out.data, status=status.HTTP_200_OK)
    

# GET /api/predictions/<pk>/  (Full result including explanation & recs)
class PredictionDetailView(generics.RetrieveAPIView):
    queryset = Prediction.objects.select_related('explanation', 'health_input').prefetch_related('recommendations')
    serializer_class = PredictionSerializer
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        """
        Ensure user can only fetch their own predictions.
        """
        obj = super().get_object()
        if obj.health_input.user != self.request.user:
            raise permissions.PermissionDenied('Not allowed.')
        return obj

# GET /api/predictions/all/  or  /api/predictions/latest/
class PredictionListView(generics.ListAPIView):
    """
    Returns the authenticated user's own predictions, newest first.
    Accepts optional `?latest=1` query param to return only the most recent prediction.
    """
    serializer_class = PredictionSerializer
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = (
            Prediction.objects
            .filter(health_input__user=self.request.user)
            .select_related('explanation', 'health_input')
            .prefetch_related('recommendations')
            .order_by('-created_at')
        )
        if self.kwargs.get('latest'):
            return qs[:1]
        return qs

# GET /api/predictions/<pk>/explanation/
class ExplanationDetailView(generics.RetrieveAPIView):
    serializer_class = ExplanationSerializer
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        prediction = get_object_or_404(Prediction, pk=self.kwargs['pk'])
        if prediction.health_input.user != self.request.user:
            raise permissions.PermissionDenied('Not allowed.')
        return prediction.explanation

# GET /api/predictions/<pk>/recommendations/
class RecommendationListView(generics.ListAPIView):
    serializer_class = RecommendationSerializer
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        prediction = get_object_or_404(Prediction, pk=self.kwargs['pk'])
        if prediction.health_input.user != self.request.user:
            raise permissions.PermissionDenied('Not allowed.')
        return prediction.recommendations.all()
    
    def list(self, request, *args, **kwargs):
        """
        Return recommendations grouped by category, in default model ordering.
        {
          "diet": [ { ... }, { ... } ],
          "exercise": [ { ... } ],
          "habits": [ { ... } ]
        }
        """
        recs = self.get_queryset()
        serializer = self.get_serializer(recs, many=True)
        grouped = {}
        for rec in serializer.data:
            grouped.setdefault(rec['category'], []).append(rec)
        return Response(grouped, status=status.HTTP_200_OK)