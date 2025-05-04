import { useEffect, useState } from 'react';
import { fetchLatestPrediction } from '../services/predictions';
import { NavLink } from 'react-router-dom';

export default function UnreadRecsBanner() {
  const [count, setCount] = useState(0);
  const [predId, setPredId] = useState(null);

//   Unread recommendations are those that have not been
// reviewed as "helpful" or "not relevant"
  useEffect(() => {
    fetchLatestPrediction().then((p) => {
      if (!p) return;
      const unread = p.recommendations.filter((r) => r.helpful === null).length;
      setCount(unread);
      setPredId(p.id);
    });
  }, []);

  if (!count) return null;

  return (
    <div className="bg-yellow-100 text-yellow-800 rounded-lg p-4 text-sm flex justify-between items-center">
      <span>You have {count} new recommendation{count > 1 && 's'} to review.</span>
      <NavLink
        to={`/predict/${predId}/recommendations`}
        className="underline font-medium">
        View tips →
      </NavLink>
    </div>
  );
}