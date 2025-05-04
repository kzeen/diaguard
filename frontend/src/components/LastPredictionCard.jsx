import { NavLink } from 'react-router-dom';

function getLabel(level) {
  const num = Number(level);
  if (!Number.isNaN(num)) {
    return ['low', 'medium', 'high'][num] || 'unknown';
  }
  return level;
}

export default function LastPredictionCard({ pred }) {
  if (!pred) {
    return (
      <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold mb-4">Last Prediction</h3>
        <p className="text-gray-500 text-sm">No predictions yet.</p>
      </div>
    );
  }

  const label = getLabel(pred.risk_level);
  const badgeClasses = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
    unknown: 'bg-gray-100 text-gray-700',
  }[label];

  const gaugePercent =
    label === 'low' ? 33 : label === 'medium' ? 66 : label === 'high' ? 100 : 0;

  return (
    <div className="bg-white shadow rounded-lg p-6 flex flex-col">
      <h3 className="text-lg font-semibold mb-6 text-center">
        Last Prediction
      </h3>

      {/* Badge */}
      <div className="flex justify-center">
        <span className={`px-4 py-1 rounded-full text-sm font-medium ${badgeClasses}`}>
          {label.toUpperCase()}
        </span>
      </div>

      {/* Confidence + gauge */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 mb-2">
          Confidence&nbsp;
          <strong>{(pred.confidence_score * 100).toFixed(1)}%</strong>
        </p>

        {/* simple gauge bar */}
        <div className="w-full bg-light h-2 rounded">
          <div
            className="h-2 rounded bg-primary"
            style={{ width: `${gaugePercent}%` }}
          />
        </div>
      </div>

      {/* Timestamp */}
      <p className="mt-4 text-xs text-gray-400 text-center">
        {new Date(pred.created_at).toLocaleString()}
      </p>

      {/* CTA */}
      <NavLink
        to={`/predict/${pred.id}/`}
        className="mt-6 self-center text-primary text-sm underline"
      >
        View details →
      </NavLink>
    </div>
  );
}