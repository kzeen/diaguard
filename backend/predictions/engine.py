import operator
from typing import Any
from django.core.cache import cache
from .models import Recommendation, RecommendationTemplate
from .rules_loader import load_recommendation_rules

TEMPLATE_CACHE_KEY = 'recommendation_template_map'
TEMPLATE_TTL       = 24 * 3600

def _get_template_map():
    """
    Returns a dict cached in local memory
    """
    tmpl_map = cache.get(TEMPLATE_CACHE_KEY)
    if tmpl_map is None:
        qs = RecommendationTemplate.objects.all()
        tmpl_map = {t.pk: t for t in qs}
        cache.set(TEMPLATE_CACHE_KEY, tmpl_map, timeout=TEMPLATE_TTL)
    return tmpl_map

def _evaluate_condition(value: Any, condition: str) -> bool:
    """
    Given a Python value and a condition string ('>= 30', '100 - 125', '== True'),
    return True if the condition holds.
    """
    condition = condition.strip()

    if '-' in condition and condition.replace('-', '').replace('.', '').replace(' ', '').isdigit():
        low_s, high_s = condition.split('-', 1)
        low, high = float(low_s), float(high_s)
        return low <= float(value) <= high

    ops = {
        '>=': operator.ge,
        '<=': operator.le,
        '>' : operator.gt,
        '<' : operator.lt,
        '==': operator.eq,
    }
    for symbol, func in ops.items():
        if condition.startswith(symbol):
            num = float(condition[len(symbol):].strip())
            return func(float(value), num)

    if condition.startswith("=="):
        target = condition[2:].strip()
        target = target.strip("'\"")
        return str(value) == target

    # Nothing matches, error
    raise ValueError(f"Unrecognized condition: {condition}")

def generate_recommendations(
    health_input: Any,
    prediction: Any,
    shap_values: dict,
    lime_summary: list[dict],
    max_recs: int = 5
) -> list[Recommendation]:
    """
    1) Loads rules from CSV
    2) Evaluates each rule in priority order
    3) For each match, instantiates a Recommendation based on the template
    4) Stops after max_recs recommendations
    """
    rules = load_recommendation_rules()

    created = []
    tmpl_map = _get_template_map()
    for r in rules:
        driver = r.driver
        cond = r.condition

        # SHAP‐based driver
        if driver.startswith('shap[') and driver.endswith(']'):
            feat = driver[5:-1]
            val = shap_values.get(feat)
            if val is None: 
                continue

        # LIME‐based driver (appearance rule)
        elif driver.startswith('LIME:'):
            feat_rule = driver[5:].strip().strip('"').strip("'")
            if cond.lower() != 'appears':
                continue
            found = any(item['feature'] == feat_rule for item in lime_summary)
            if not found:
                continue
            val = True

        # Raw input driver
        else:
            if hasattr(health_input, driver):
                val = getattr(health_input, driver)
            elif hasattr(prediction, driver):
                val = getattr(prediction, driver)
            else:
                try:
                    val = health_input[driver]
                except Exception:
                    continue

        if driver.startswith('LIME:'):
            passed = True
        else:
            try:
                passed = _evaluate_condition(val, cond)
            except ValueError:
                passed = False

        if not passed:
            continue

        template = tmpl_map.get(r.template_pk)
        if template is None:
            continue
        
        context = {
            'bmi': health_input.bmi,
            'blood_glucose_level': health_input.blood_glucose,
            'HbA1c_level': health_input.hba1c,
            'age': health_input.age,
            'hypertension': health_input.hypertension,
            'heart_disease': health_input.heart_disease,
            'smoking_history': health_input.smoking_history,
        }
        content = template.template_text.format(**context)

        rec = Recommendation.objects.create(
            prediction=prediction,
            category=template.category,
            content=content
        )
        created.append(rec)

        if len(created) >= max_recs:
            break

    return created