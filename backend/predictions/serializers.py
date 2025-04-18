from rest_framework import serializers
from .models import (
    HealthInput,
    Prediction,
    Explanation,
    Recommendation,
)
from django.utils.translation import gettext_lazy as _

class HealthInputSerializer(serializers.ModelSerializer):
    """
    Serializes raw health data submitted by the user.
    Performs basic validation
    """

    class Meta:
        model = HealthInput
        # We don’t expose user (set in the view via request.user)
        exclude = ('user',)

    # ---- field‑level validation examples ----
    def validate_age(self, value):
        if not 1 <= value <= 120:
            raise serializers.ValidationError(_('Age must be between 1 and 120.'))
        return value

    def validate_bmi(self, value):
        if value <= 0:
            raise serializers.ValidationError(_('BMI must be positive.'))
        return value

    def validate_hba1c(self, value):
        if not 3.0 <= value <= 15.0:
            raise serializers.ValidationError(_('HbA1c value is out of realistic range.'))
        return value

    def validate_blood_glucose(self, value):
        if value <= 0:
            raise serializers.ValidationError(_('Blood glucose must be positive.'))
        return value

class RecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recommendation
        fields = ('id', 'category', 'content', 'created_at')

class ExplanationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Explanation
        # Return full JSON blobs; frontend will parse
        fields = ('shap_values', 'lime_summary', 'generated_at')

class PredictionSerializer(serializers.ModelSerializer):
    explanation = ExplanationSerializer(read_only=True)
    recommendations = RecommendationSerializer(many=True, read_only=True)

    class Meta:
        model = Prediction
        fields = (
            'id',
            'risk_level',
            'confidence_score',
            'created_at',
            'explanation',
            'recommendations',
        )

# Combined Serializer for POST /api/predict
class PredictionRequestSerializer(HealthInputSerializer):
    """
    Used for create‑prediction endpoint.
    Inherits all HealthInput fields, then overrides create()
    to: 1) save HealthInput, 2) run ML inference (placeholder),
    3) build the Prediction + (optionally) Explanation + Recs,
    4) return a nested PredictionSerializer response.
    """

    # Will hold the response once create() assembles it.
    prediction = serializers.SerializerMethodField(read_only=True)

    def create(self, validated_data):
        """
        Expects self.context['request'].user to be present (enforced in view).
        """
        user = self.context['request'].user
        health_input = HealthInput.objects.create(user=user, **validated_data)

        # -------------- ML inference placeholder --------------
        # >>> replace with real model call later
        risk_level = self._dummy_risk_label(health_input)
        confidence = 0.83
        # ------------------------------------------------------

        prediction = Prediction.objects.create(
            health_input=health_input,
            risk_level=risk_level,
            confidence_score=confidence,
        )

        # Placeholder explanation (empty JSON). Replace with SHAP/LIME later.
        Explanation.objects.create(prediction=prediction, shap_values={}, lime_summary={})

        # Maybe generate auto recommendations (dummy example):
        Recommendation.objects.create(
            prediction=prediction,
            category=Recommendation.Category.DIET,
            content='Increase your intake of leafy greens and reduce sugary drinks.',
        )

        return health_input  # DRF will run to_representation()

    def get_prediction(self, obj):
        return PredictionSerializer(obj.prediction).data

    @staticmethod
    def _dummy_risk_label(health_input):
        # simplistic rule‑based stub
        return (
            Prediction.RiskLevel.HIGH
            if health_input.bmi > 30 or health_input.hba1c > 6.5
            else Prediction.RiskLevel.MEDIUM
        )
