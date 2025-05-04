import { useEffect, useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { fetchPredictionsList } from '../services/predictions';
import Spinner from '../components/Spinner';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';
import { format } from 'date-fns';

const riskColor = { low: '#22c55e', medium: '#fbbf24', high: '#ef4444' };
const riskIndex = { low: 0, medium: 1, high: 2, '0': 0, '1': 1, '2': 2 };

export default function HistoryPage() {
    const [raw, setRaw] = useState(null);
    const [filter, setFilter] = useState({ level: 'all', from: '', to: '' });

    /* ---------- fetch list ---------- */
    useEffect(() => {
        fetchPredictionsList().then(setRaw).catch(console.error);
    }, []);

    /* ---------- apply filters ---------- */
    const filtered = useMemo(() => {
        if (!raw) return [];
        return raw.filter((p) => {
            /* risk‑level filter */
            if (filter.level !== 'all') {
                if (
                    riskIndex[p.risk_level] !== riskIndex[filter.level]
                )
                    return false;
            }
            /* date range filter */
            const d = new Date(p.created_at);
            if (filter.from && d < new Date(filter.from)) return false;
            if (filter.to && d > new Date(filter.to)) return false;
            return true;
        });
    }, [raw, filter]);

    if (!raw) return <Spinner />;

    /* ---------- stats ---------- */
    const total = filtered.length;
    const byLevel = { low: 0, medium: 0, high: 0 };
    filtered.forEach(
        (p) =>
        (byLevel[
            ['low', 'medium', 'high'][riskIndex[p.risk_level]] ?? p.risk_level
        ] += 1)
    );

    /* ---------- trend data ---------- */
    const trend = filtered
        .slice()
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        .map((p) => ({
            date: format(new Date(p.created_at), 'MMM d'),
            value: riskIndex[String(p.risk_level).toLowerCase()],
        }));

    return (
        <div className="w-full px-8 space-y-12">
            <h2 className="text-3xl font-bold text-center mt-6">Prediction History</h2>

            {/* filters */}
            <div className="flex flex-wrap gap-4 justify-center">
                <select
                    value={filter.level}
                    onChange={(e) => setFilter({ ...filter, level: e.target.value })}
                    className="border rounded p-1 text-sm"
                >
                    <option value="all">All risk levels</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>

                <input
                    type="date"
                    value={filter.from}
                    onChange={(e) => setFilter({ ...filter, from: e.target.value })}
                    className="border rounded p-1 text-sm"
                />
                <span className="text-sm self-center">to</span>
                <input
                    type="date"
                    value={filter.to}
                    onChange={(e) => setFilter({ ...filter, to: e.target.value })}
                    className="border rounded p-1 text-sm"
                />
            </div>

            {/* stats row */}
            <div className="flex flex-wrap justify-center gap-6">
                <StatCard label="Total" value={total} />
                <StatCard label="Low" value={byLevel.low} color={riskColor.low} />
                <StatCard label="Medium" value={byLevel.medium} color={riskColor.medium} />
                <StatCard label="High" value={byLevel.high} color={riskColor.high} />
            </div>

            {/* trend */}
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="font-semibold mb-4 text-center">
                    Risk level trend (chronological)
                </h3>
                {trend.length > 1 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis
                                ticks={[0, 1, 2]}
                                domain={[0, 2]}
                                tickFormatter={(v) => ['Low', 'Medium', 'High'][v] ?? ''}
                            />
                            <Tooltip formatter={(v) => ['Low', 'Medium', 'High'][v] ?? ''} />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#2563eb"
                                dot={{ r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-sm text-gray-500 text-center">
                        Add more predictions to see a trend.
                    </p>
                )}
            </div>

            {/* table */}
            <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
                <table className="w-full text-sm lg:text-base">
                    <thead>
                        <tr className="text-gray-500 border-b">
                            <th className="py-2 text-center">Date</th>
                            <th className="py-2 text-center">Risk</th>
                            <th className="py-2 text-center">Confidence</th>
                            <th className="py-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((p) => (
                            <tr key={p.id} className="border-b last:border-0">
                                <td className="py-2 text-center">
                                    {format(new Date(p.created_at), 'PPP p')}
                                </td>
                                <td className="py-2 text-center">
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.risk_level === 'low'
                                            ? 'bg-green-100 text-green-700'
                                            : p.risk_level === 'medium'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}
                                    >
                                        {p.risk_level.toUpperCase()}
                                    </span>
                                </td>
                                <td className="py-2 text-center">
                                    {(p.confidence_score * 100).toFixed(1)}%
                                </td>
                                <td className="py-2 text-center">
                                    <NavLink
                                        to={`/predict/${p.id}/result`}
                                        className="text-primary hover:underline text-xs"
                                    >
                                        View
                                    </NavLink>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {!filtered.length && (
                    <p className="text-sm text-gray-500 text-center mt-4">
                        No predictions match the selected filters.
                    </p>
                )}
            </div>
        </div>
    );
}

/* ---------- helper ---------- */
function StatCard({ label, value, color }) {
    return (
        <div className="bg-white shadow rounded-lg p-4 text-center w-24">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-2xl font-bold" style={{ color: color ?? 'inherit' }}>
                {value}
            </p>
        </div>
    );
}
