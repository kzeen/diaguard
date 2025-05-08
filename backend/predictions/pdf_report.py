import base64
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from io import BytesIO
from django.template.loader import render_to_string
from weasyprint import HTML, CSS


def _shap_chart(shap_dict):
    # sort by absolute value, take top 10
    pairs = sorted(shap_dict.items(), key=lambda kv: abs(kv[1]), reverse=True)[:10]
    labels = [k.replace('_', ' ').title() for k, _ in pairs]
    values = [v for _, v in pairs]
    colors = ['#2563eb' if v > 0 else '#dc2626' for v in values]

    fig, ax = plt.subplots(figsize=(4, 3))
    ax.barh(labels[::-1], values[::-1], color=colors[::-1])
    ax.set_xlabel('SHAP value')
    ax.set_ylim(-0.5, len(labels) - 0.5)
    fig.tight_layout()

    buf = BytesIO()
    plt.savefig(buf, format='png', dpi=150, bbox_inches='tight')
    plt.close(fig)
    return base64.b64encode(buf.getvalue()).decode('ascii')


def build_pdf(prediction):
    """Return PDF bytes for a Prediction instance."""
    shap_img_b64 = _shap_chart(prediction.explanation.shap_values)

    html_str = render_to_string(
        'predictions/pdf_report.html',
        {
            'pred': prediction,
            'shap_img_b64': shap_img_b64,
        },
    )
    pdf = HTML(string=html_str, base_url='').write_pdf(
        stylesheets=[CSS(string='@page { size: A4; margin: 1.5cm }')]
    )
    return pdf