from django.contrib import admin
from .models import HealthInput, Prediction, Explanation, Recommendation

admin.site.register(HealthInput)
admin.site.register(Prediction)
admin.site.register(Explanation)
admin.site.register(Recommendation)
