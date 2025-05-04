import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { fetchPredictionDetail } from '../services/predictions';
import Spinner from '../components/Spinner';
import RiskBadge from '../components/RiskBadge';

export default function PredictionResultPage() {
  const { id } = useParams();
  const [pred, setPred] = useState(null);

  useEffect(() => {
    fetchPredictionDetail(id)
      .then(setPred)
      .catch((e) => {
        console.error('detail fetch failed', e);
        setPred({ error: true });
      });
  }, [id]);

  if (!pred) return <Spinner />;

  if (pred.error) return (
    <p className="text-center text-red-600" >
      Unable to load this prediction.Try reloading the page.
    </p>
  );

  // SHAP top features if available
  const topFactors =
    pred.explanation?.shap_values
      ? Object.entries(pred.explanation.shap_values)
        .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
        .slice(0, 5)
      : [];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-center">Prediction Summary</h2>

      <div className="bg-white shadow rounded-lg p-6 text-center space-y-3">
        <RiskBadge level={['low', 'medium', 'high'][Number(pred.risk_level)] || pred.risk_level} />
        <p>
          Confidence:{' '}
          <strong>{(pred.confidence_score * 100).toFixed(1)}%</strong>
        </p>
        <p className="text-xs text-gray-500">
          {new Date(pred.created_at).toLocaleString()}
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="font-semibold mb-2">Top contributing features</h3>
        {topFactors.length ? (
          <ul className="list-disc list-inside text-sm space-y-1">
            {topFactors.map(([k, v]) => (
              <li key={k}>
                {k}: {v.toFixed(2)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No explanations available.</p>
        )}
      </div>

      <div className="flex gap-4 justify-center">
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
      </div>
    </div>
  );
}