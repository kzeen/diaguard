import csv
import os
from .models import RecommendationTemplate
from typing import NamedTuple
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured

class RecommendationRule(NamedTuple):
    driver: str
    condition: str
    category: str
    sub_category: str
    template_pk: int
    priority: int
    notes: str

def load_recommendation_rules(filename: str = 'recommendation_rules.csv') -> list[RecommendationRule]:
    """
    Reads the rules CSV and returns a list of RecommendationRule,
    sorted by ascending priority.
    """
    app_dir = os.path.dirname(__file__)
    csv_path = os.path.join(app_dir, filename)
    if not os.path.exists(csv_path):
        raise ImproperlyConfigured(f"Rules file not found: {csv_path}")
     
    rules = []
    with open(csv_path, newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                rule = RecommendationRule(
                    driver=row['driver'].strip(),
                    condition=row['condition'].strip(),
                    category=row['category'].strip(),
                    sub_category=row['sub_category'].strip(),
                    template_pk=int(row['template_pk']),
                    priority=int(row['priority']),
                    notes=row.get('notes','').strip()
                )
            except (KeyError, ValueError) as e:
                raise ImproperlyConfigured(f"Invalid rule row: {row} - {e}")
            rules.append(rule)
    rules.sort(key=lambda r: r.priority)
    return rules

def validate_rules(rules: list[RecommendationRule]):
    pks = {t.pk for t in RecommendationTemplate.objects.all()}

    for r in rules:
        if r.template_pk not in pks:
            raise ImproperlyConfigured(f"Rule refers to missing template PK {r.template_pk}")