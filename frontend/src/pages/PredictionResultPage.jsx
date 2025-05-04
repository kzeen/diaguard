import { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { fetchPredictionDetail } from '../services/predictions';
import Spinner from '../components/Spinner';
import RiskBadge from '../components/RiskBadge';
import ConfidenceGauge from '../components/ConfidenceGauge';
import FeatureImportanceChart from '../components/FeatureImportanceChart';
import RiskLegend from '../components/RiskLegend';
import BarColorLegend from '../components/BarColorLegend';
import MiniRecommendations from '../components/MiniRecommendations';

export default function PredictionResultPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [pred, setPred] = useState(null);

  useEffect(() => {
    fetchPredictionDetail(id)
      .then(setPred)
      .catch(() => setPred({ error: true }));
  }, [id]);

  if (!pred) return <Spinner />;
  if (pred.error)
    return (
      <p className="text-center text-red-600">
        Failed to load prediction. Try again.
      </p>
    );

  // Prepare top factors
  const topFactors = pred.explanation
    ? Object.entries(pred.explanation.shap_values)
      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
      .slice(0, 10)
    : [];

  // Confidence interpretation
  const pct = Math.round(pred.confidence_score * 100);
  const confidenceText =
    pct >= 80
      ? 'high certainty - model is confident'
      : pct >= 50
        ? 'moderate certainty - model is somewhat confident'
        : 'low certainty - consider re-evaluating your data';

  const riskLabels = {
    low: 'LOW risk: lifestyle looks healthy; keep monitoring.',
    medium:
      'MEDIUM risk: some factors contribute; consider recommendations',
    high: 'HIGH risk: consult a clinician and follow recommendations.',
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-center mt-4">
        Prediction Summary
      </h2>

      {/* Risk & confidence card */}
      <div className="bg-white shadow rounded-lg p-6 grid sm:grid-cols-2 gap-6 items-center">
        <div className="text-center space-y-3">
          <RiskBadge level={pred.risk_level} />
          <p className="text-sm text-gray-600">
            {
              riskLabels[
              ['low', 'medium', 'high'][Number(pred.risk_level)] ||
              pred.risk_level?.toLowerCase()
              ]
            }
          </p>
          <p className="text-xs text-gray-400">
            {new Date(pred.created_at).toLocaleString()}
          </p>
          <RiskLegend />
        </div>

        <ConfidenceGauge confidence={pred.confidence_score} />
      </div>

      <p className="text-sm text-gray-700 text-center font-medium">
        The model has <strong>{confidenceText}</strong> ( {pct}% ).
      </p>

      {/* Feature importance */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="font-semibold mb-4 text-center">Top contributing features</h3>
        {topFactors.length ? (
          <div>
            <FeatureImportanceChart items={topFactors} />
            <BarColorLegend />
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center">
            (No explanation data available)
          </p>
        )}
      </div>

      <MiniRecommendations recs={pred.recommendations} />

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-4">
        <NavLink
          to={`/predict/${id}/explanation`}
          className="px-5 py-2 bg-primary text-white rounded hover:bg-primary/90">
          View Explanation
        </NavLink>
        <NavLink
          to={`/predict/${id}/recommendations`}
          className="px-5 py-2 bg-primary text-white rounded hover:bg-primary/90">
          View Recommendations
        </NavLink>
        <button
          onClick={() => alert('Coming soon')}
          className="px-5 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
          Download as PDF
        </button>
        <button
          onClick={() => nav('/dashboard')}
          className="px-5 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
          Back to Dashboard
        </button>
      </div>

      {/* Confidence explainer */}
      <p className="text-xs text-gray-500 text-center px-4">
        The <strong>confidence</strong> is how certain the model is in its risk
        classification &mdash; not the probability of having diabetes. A model
        can be 91 % confident you are in the low-risk class, meaning there is a
        9 % chance it assigns you to another class if given similar data.
      </p>
    </div>
  );
}