from django.contrib import admin
from .models import HealthInput, Prediction, Explanation, Recommendation, RecommendationTemplate

admin.site.register(HealthInput)
admin.site.register(Prediction)
admin.site.register(Explanation)
admin.site.register(Recommendation)
# To be able to modify rules without changing code
@admin.register(RecommendationTemplate)
class RecommendationTemplateAdmin(admin.ModelAdmin):
    list_display = ('category', 'sub_category', 'template_text', 'created_at')
    list_filter  = ('category', 'sub_category')
    search_fields = ('template_text',)
