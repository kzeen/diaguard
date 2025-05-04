from rest_framework import serializers
from .models import HealthInput, Prediction, Explanation, Recommendation
from .ml_utils import predict_risk, get_shap_values, get_lime_summary
from .engine import generate_recommendations
from django.db import transaction
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

class HealthInputSerializer(serializers.ModelSerializer):
    """
    Serializes raw health data submitted by the user.
    Performs basic validation
    """
    class Meta:
        model = HealthInput
        exclude = ('user',)

    def validate_gender(self, value):
        if value not in HealthInput.GenderChoices.values:
            raise serializers.ValidationError(_('Invalid gender.'))
        return value
    
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
        fields = ('id', 'category', 'content', 'created_at', 'helpful', 'feedback_at')

class RecommendationFeedbackSerializer(serializers.Serializer):
    helpful = serializers.BooleanField()

    def validate_helpful(self, value):
        return value

class ExplanationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Explanation
        # Return full JSON, frontend will parse
        fields = ('shap_values', 'lime_summary', 'generated_at')

class PredictionSerializer(serializers.ModelSerializer):
    explanation = ExplanationSerializer(read_only=True)
    recommendations = RecommendationSerializer(many=True, read_only=True)
    health_input = serializers.SerializerMethodField()

    class Meta:
        model = Prediction
        fields = (
            'id',
            'risk_level',
            'confidence_score',
            'created_at',
            'explanation',
            'recommendations',
            'health_input',
        )
    
    def get_health_input(self, obj):
        hi = obj.health_input
        return {
            "age": hi.age,
            "bmi": float(hi.bmi),
            "hba1c": float(hi.hba1c),
            "blood_glucose": float(hi.blood_glucose),
            "created_at": hi.created_at,
        }

# Combined Serializer for POST /api/predict
class PredictionRequestSerializer(HealthInputSerializer):
    """
    Used for create‑prediction endpoint.
    Inherits all HealthInput fields, then overrides create()
    to: 
    1) save HealthInput, 
    2) run ML inference,
    3) build the Prediction + Explanation + Recs,
    4) return a nested PredictionSerializer response.
    All in atomic transaction
    """

    # Will hold the response once create() assembles it.
    prediction = serializers.SerializerMethodField(read_only=True)

    def create(self, validated_data):
        user = self.context['request'].user

        with transaction.atomic():
            health_input = HealthInput.objects.create(user=user, **validated_data)

            # ML Inference
            input_data = {
                "gender": health_input.gender,
                "age": health_input.age,
                "hypertension": int(health_input.hypertension),
                "heart_disease": int(health_input.heart_disease),
                "smoking_history": health_input.smoking_history,
                "bmi": float(health_input.bmi),
                "HbA1c_level": float(health_input.hba1c),
                "blood_glucose_level": float(health_input.blood_glucose),
            }
            result = predict_risk(input_data)
            risk_level = result["label"]
            confidence = result["probability"]

            prediction = Prediction.objects.create(
                health_input=health_input,
                risk_level=risk_level,
                confidence_score=confidence,
            )

            # SHAP and LIME explanations
            shap_dict = get_shap_values(input_data)
            lime_list = get_lime_summary(input_data, num_features=5) # Top 5 features
            Explanation.objects.create(
                prediction=prediction,
                shap_values=shap_dict,
                lime_summary=lime_list,
            )

            # Recommendations
            Recommendation.objects.filter(prediction=prediction).delete()
            generate_recommendations(
                health_input=health_input,
                prediction=prediction,
                shap_values=shap_dict,
                lime_summary=lime_list,
                max_recs=5
            )

        return health_input

    def get_prediction(self, obj):
        return PredictionSerializer(obj.prediction).data
