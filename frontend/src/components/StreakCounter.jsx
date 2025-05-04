import { useEffect, useState } from 'react';
import { fetchAllPredictions } from '../services/predictions';

function calcStreak(dates) {
  if (!dates.length) return 0;
  const dayMs = 86400000;
  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const diff = (dates[i - 1] - dates[i]) / dayMs;
    if (diff <= 1.1) streak += 1;
    else break;
  }
  return streak;
}

export default function StreakCounter() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    fetchAllPredictions().then((arr) => {
      const dates = arr
        .map((p) => new Date(p.created_at))
        .sort((a, b) => b - a);
      setStreak(calcStreak(dates));
    });
  }, []);

  if (!streak) return null;

  return (
    <div className="bg-white shadow rounded-lg p-6 text-center">
      <h3 className="text-lg font-semibold">Logging Streak</h3>
      <p className="text-3xl font-bold mt-2">{streak} day{streak > 1 && 's'}</p>
    </div>
  );
}