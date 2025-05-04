import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  YAxis,
  XAxis,
  Tooltip,
} from 'recharts';
import Spinner from './Spinner';
import { fetchAllPredictions } from '../services/predictions';

export default function RiskTrend() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const map = { low: 1, medium: 2, high: 3, '0': 1, '1': 2, '2': 3 };
    fetchAllPredictions().then((arr) =>
      setData(
        arr
          .slice(-10)
          .reverse()
          .map((p) => ({
            date: new Date(p.created_at).toLocaleDateString(),
            score: map[p.risk_level] ?? 0,
          }))
      )
    );
  }, []);

  if (!data) return <Spinner />;
  if (!data.some((d) => d.score)) return null; // still no data

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-center">Risk Trend</h3>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={data}>
          <XAxis dataKey="date" hide />
          <YAxis domain={[1, 3]} ticks={[1, 2, 3]} hide />
          <Tooltip
            formatter={(v) => ({ 1: 'Low', 2: 'Medium', 3: 'High' }[v] || v)}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}