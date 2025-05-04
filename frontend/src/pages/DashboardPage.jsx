import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchLatestPrediction, fetchHealthTip } from '../services/predictions';
import Spinner from '../components/Spinner';
import LastPredictionCard from '../components/LastPredictionCard';
import HealthTip from '../components/HealthTip';
import QuickActions from '../components/QuickActions';
import RiskTrend from '../components/RiskTrend';
import InputsTable from '../components/InputsTable';
import UnreadRecsBanner from '../components/UnreadRecsBanner';
import StreakCounter from '../components/StreakCounter';
import Fab from '../components/Fab';
import LatestRecs from '../components/LatestRecs';

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
        <UnreadRecsBanner/>

        <h1 className="text-2xl font-bold">
            Welcome back, {user.first_name || user.username}!
        </h1>

        <div className="grid lg:grid-cols-2 gap-6">
            <LastPredictionCard pred={latest} />
            <HealthTip tip={tip} />
        </div>

        <RiskTrend/>

        <InputsTable/>
        <StreakCounter/>

        <LatestRecs/>

        <Fab/>

        <QuickActions />
    </div>
  );
}