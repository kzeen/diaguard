import { useEffect, useState } from 'react';
import { fetchLatestPrediction } from '../services/predictions';
import { Dumbbell, Leaf, Lightbulb } from 'lucide-react';

const style = {
  base: 'flex items-start gap-3 p-4 rounded-lg shadow-sm',
  exercise: 'bg-blue-50 text-blue-900',
  diet: 'bg-emerald-50 text-emerald-900',
  habits: 'bg-amber-50 text-amber-900',
};

function iconFor(cat) {
  switch (cat) {
    case 'exercise':
      return <Dumbbell className="shrink-0" />;
    case 'diet':
      return <Leaf className="shrink-0" />;
    default:
      return <Lightbulb className="shrink-0" />;
  }
}

export default function LatestRecs() {
  const [recs, setRecs] = useState([]);

  useEffect(() => {
    fetchLatestPrediction().then((p) => {
      if (p) setRecs(p.recommendations.slice(0, 5));
    });
  }, []);

  if (!recs.length) return null;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-6 text-center">
        Recommendations from Latest Prediction
      </h3>

      <div className="grid sm:grid-cols-2 gap-4">
        {recs.map((r) => (
          <div
            key={r.id}
            className={`${style.base} ${
              style[r.category] ?? 'bg-gray-50 text-gray-900'
            }`}
          >
            {iconFor(r.category)}
            <p className="text-sm leading-relaxed">{r.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}