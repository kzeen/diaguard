from django.test import TestCase
from predictions.rules_loader import load_recommendation_rules

class RulesLoaderTest(TestCase):
    def test_load_rules(self):
        rules = load_recommendation_rules()
        self.assertGreater(len(rules), 0)
        first = rules[0]
        self.assertIsInstance(first.priority, int)
        self.assertIn('>=', first.condition)
