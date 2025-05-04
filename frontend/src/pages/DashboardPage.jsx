import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchLatestPrediction, fetchHealthTip } from '../services/predictions';
import Spinner from '../components/Spinner';
import LastPredictionCard from '../components/LastPredictionCard';
import HealthTip from '../components/HealthTip';
import QuickActions from '../components/QuickActions';

export default function DashboardPage() {
  const { user } = useAuth();
  const [latest, setLatest] = useState(null);
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [pred, tipObj] = await Promise.all([
          fetchLatestPrediction(),
          fetchHealthTip(),
        ]);
        setLatest(pred);
        setTip(tipObj.tip);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-10">
      {/* Greeting */}
      <h1 className="text-2xl font-bold">
        Welcome back, {user.first_name || user.username}!
      </h1>

      {/* Two‑column grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <LastPredictionCard pred={latest} />
        <HealthTip tip={tip} />
      </div>

      {/* Quick links */}
      <QuickActions />
    </div>
  );
}