from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
import re


class HealthInput(models.Model):
    """Raw health data provided by a user for diabetes risk prediction."""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='health_inputs'
    )

    class GenderChoices(models.TextChoices):
        MALE = 'Male', _('Male')
        FEMALE = 'Female', _('Female')
        OTHER = 'Other', _('Other')

    gender = models.CharField(
        max_length=6,
        choices=GenderChoices.choices,
        default=GenderChoices.OTHER
    )

    age = models.PositiveSmallIntegerField()
    hypertension = models.BooleanField(default=False)
    heart_disease = models.BooleanField(default=False)

    class SmokingChoices(models.TextChoices):
        CURRENT     = 'current',     _('current')
        EVER        = 'ever',        _('ever')
        FORMER      = 'former',      _('former')
        NEVER       = 'never',       _('never')
        NOT_CURRENT = 'not current', _('not current')
        NO_INFO     = 'No Info',     _('No Info')

    smoking_history = models.CharField(
        max_length=11,
        choices=SmokingChoices.choices,
        default=SmokingChoices.NO_INFO
    )

    bmi = models.DecimalField(max_digits=5, decimal_places=2) # ex. 32.15
    hba1c = models.DecimalField(max_digits=4, decimal_places=2) # ex. 6.85
    blood_glucose = models.DecimalField(max_digits=6, decimal_places=1) # ex. 145.0 mg/dL

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'HealthInput #{self.id} by {self.user.username}'


class Prediction(models.Model):
    """Model output for a single HealthInput."""
    health_input = models.OneToOneField(
        HealthInput,
        on_delete=models.CASCADE,
        related_name='prediction'
    )

    class RiskLevel(models.TextChoices):
        LOW    = 'low',    _('Low')
        MEDIUM = 'medium', _('Medium')
        HIGH   = 'high',   _('High')

    risk_level = models.CharField(
        max_length=6,
        choices=RiskLevel.choices
    )
    confidence_score = models.FloatField(help_text=_('Value in [0,1] from the classifier'))
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Prediction #{self.id} → {self.risk_level}'


class Explanation(models.Model):
    """Persist SHAP or LIME artefacts for later retrieval."""
    prediction = models.OneToOneField(
        Prediction,
        on_delete=models.CASCADE,
        related_name='explanation'
    )
    shap_values = models.JSONField(blank=True, null=True)
    lime_summary = models.JSONField(blank=True, null=True)

    generated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Explanation for Prediction #{self.prediction_id}'


class Recommendation(models.Model):
    """Actionable tips linked to a prediction (many‑to‑one)."""
    prediction = models.ForeignKey(
        Prediction,
        on_delete=models.CASCADE,
        related_name='recommendations'
    )

    class Category(models.TextChoices):
        DIET      = 'diet',      _('Diet')
        EXERCISE  = 'exercise',  _('Exercise')
        HABITS    = 'habits',    _('Habits')

    category = models.CharField(max_length=10, choices=Category.choices)
    content = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.category.title()} recommendation #{self.id}'
    
class RecommendationTemplate(models.Model):
    """
    Reusable template for generating recommendations.
    Categorized and optionally parameterized
    """
    class Category(models.TextChoices):
        DIET      = 'diet',      _('Diet')
        EXERCISE  = 'exercise',  _('Exercise')
        HABITS    = 'habits',    _('Habits')
    
    class SubCategory(models.TextChoices):
        WEIGHT_LOSS       = 'weight_loss',       _('Weight Loss')
        CARB_CONTROL      = 'carb_control',      _('Carb Control')
        HYDRATION         = 'hydration',         _('Hydration')
        CARDIO            = 'cardio',            _('Cardio')
        STRENGTH          = 'strength',          _('Strength Training')
        FLEXIBILITY       = 'flexibility',       _('Flexibility')
        SMOKING_CESSATION = 'smoking_cessation', _('Smoking Cessation')
        SLEEP_HYGIENE     = 'sleep_hygiene',     _('Sleep Hygiene')
        STRESS_REDUCTION  = 'stress_reduction',  _('Stress Reduction')

    category = models.CharField(
        max_length=10,
        choices=Category.choices
    )

    sub_category = models.CharField(
        max_length=20,
        choices=SubCategory.choices
    )

    template_text = models.TextField(
        help_text=_('Recommendation message, with optional {placeholders}')
    )
    created_at = models.DateField(auto_now_add=True)

    class Meta:
        ordering = ['category', 'sub_category']

    # Make sure only valid placeholders are allowed
    def clean(self):
        placeholders = set(re.findall(r"\{(\w+)\}", self.template_text))
        allowed = {"bmi", "blood_glucose_level", "HbA1c_level", "age", "hypertension", "heart_disease", "smoking_history"}
        invalid = placeholders - allowed
        if invalid:
            raise ValidationError(f"Invalid placeholders: {invalid}")

    def __str__(self):
        return f'{self.category}/{self.sub_category}: {self.template_text[:30]}...'