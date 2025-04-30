from rest_framework import generics, permissions, authentication, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Prediction
from .serializers import PredictionRequestSerializer, PredictionSerializer, ExplanationSerializer, RecommendationSerializer

# POST /api/predictions/  (Create health input + prediction + ...)
class PredictView(generics.CreateAPIView):
    """
    Accepts raw health data, runs dummy (or real) ML inference,
    returns nested PredictionSerializer via PredictionRequestSerializer.
    """
    serializer_class = PredictionRequestSerializer
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Simply save; all main work in serializer.create()
        serializer.save()

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

# 4. GET /api/predictions/<pk>/recommendations/
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
