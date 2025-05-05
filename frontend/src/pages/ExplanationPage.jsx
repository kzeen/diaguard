import { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { fetchPredictionExplanation } from '../services/predictions';
import Spinner from '../components/Spinner';
import Plot from 'react-plotly.js';
import usePageTitle from '../hooks/usePageTitle';

export default function ExplanationPage() {
    usePageTitle('Explanations');

    const { id } = useParams();
    const [exp, setExp] = useState(null);
    const [err, setErr] = useState(null);

    useEffect(() => {
        fetchPredictionExplanation(id)
            .then(setExp)
            .catch(() => setErr('Failed to load explanation'));
    }, [id]);

    if (err) return <p className="text-center text-red-600">{err}</p>;
    if (!exp) return <Spinner />;

    /* ---------- helper ---------- */
    const pretty = (k) =>
        k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    /* ---------- aggregate duplicate roots ---------- */
    const sums = {};
    Object.entries(exp.shap_values).forEach(([k, v]) => {
        const root = k.startsWith('smoking_history')
            ? 'Smoking History'
            : pretty(k);
        sums[root] = (sums[root] || 0) + v;
    });

    const shapArr = Object.entries(sums)
        .map(([name, val]) => ({ name, val }))
        .sort((a, b) => Math.abs(b.val) - Math.abs(a.val))
        .slice(0, 10);

    /* ---------- Waterfall plot data ---------- */
    const base = 0; // classification baseline not shown; zero works for relative view
    const cumulative = [];
    let total = base;
    shapArr.forEach((d) => {
        cumulative.push({ ...d, start: total });
        total += d.val;
    });

    /* ---------- 100% stacked bar (balance) ---------- */
    const posSum = shapArr.reduce(
        (s, d) => (d.val > 0 ? s + d.val : s),
        0
    );
    const negSum = shapArr.reduce(
        (s, d) => (d.val < 0 ? s + Math.abs(d.val) : s),
        0
    );
    const totalAbs = posSum + negSum || 1;
    const posPct = ((posSum / totalAbs) * 100).toFixed(1);
    const negPct = ((negSum / totalAbs) * 100).toFixed(1);

    /* ---------- LIME rows ---------- */
    const limeRows = exp.lime_summary ?? [];

    return (
        <div className="max-w-3xl mx-auto space-y-10">
            <h2 className="text-3xl font-bold text-center mt-4">Explanation</h2>

            {/* Waterfall */}
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="font-semibold mb-4 text-center">
                    How each feature shifted the prediction
                </h3>
                <Plot
                    data={[
                        {
                            type: 'waterfall',
                            orientation: 'v',
                            x: shapArr.map((d) => d.name),
                            y: shapArr.map((d) => d.val),
                            text: shapArr.map((d) =>
                                d.val > 0 ? '↑ increases risk' : '↓ decreases risk'
                            ),
                            textposition: 'outside',
                            connector: { line: { color: 'grey' } },
                            decreasing: { marker: { color: '#dc2626' } },
                            increasing: { marker: { color: '#2563eb' } },
                            totals: { marker: { color: '#888' } },
                        },
                    ]}
                    layout={{
                        width: 700,
                        height: 400,
                        margin: { l: 50, r: 20, t: 10, b: 120 },
                        showlegend: false,
                        xaxis: { tickangle: -45 },
                    }}
                    config={{ displayModeBar: false, responsive: true }}
                    style={{ width: '100%' }}
                />
                <p className="text-xs text-gray-500 text-center mt-2 max-w-lg mx-auto">
                    Bars build from left to right: starting at the model baseline, each
                    feature pushes the prediction up (blue) or down (red) until the final
                    output is reached at the far right.
                </p>
            </div>

            {/* balance bar */}
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="font-semibold mb-4 text-center">
                    Balance of upward vs. downward forces
                </h3>
                <Plot
                    data={[
                        {
                            type: 'bar',
                            x: [posPct, negPct],
                            y: [' '], // single row
                            orientation: 'h',
                            marker: { color: ['#2563eb', '#dc2626'] },
                            text: [`${posPct}%`, `${negPct}%`],
                            textposition: 'inside',
                            hoverinfo: 'none',
                        },
                    ]}
                    layout={{
                        barmode: 'stack',
                        width: 600,
                        height: 80,
                        margin: { l: 0, r: 0, t: 10, b: 10 },
                        xaxis: { visible: false, range: [0, 100] },
                        yaxis: { visible: false },
                        showlegend: false,
                    }}
                    config={{ displayModeBar: false, responsive: true }}
                    style={{ width: '100%' }}
                />
                <p className="text-xs text-gray-500 text-center mt-2 max-w-xs mx-auto">
                    {posPct}% of the total impact drives the prediction toward higher
                    risk, while {negPct}% pulls it lower.
                </p>
            </div>

            {/* LIME table */}
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="font-semibold mb-4 text-center">LIME summary</h3>
                {limeRows.length ? (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-gray-500 border-b">
                                <th className="py-2 w-8 text-left">#</th>
                                <th className="py-2 text-center">Feature</th>
                                <th className="py-2 w-28 text-right">Impact</th>
                            </tr>
                        </thead>
                        <tbody>
                            {limeRows.map((r, i) => (
                                <tr key={i} className="border-b last:border-0">
                                    <td className="py-2">{i + 1}</td>
                                    <td className="py-2">{r.feature}</td>
                                    <td
                                        className={`py-2 text-right ${r.impact > 0 ? 'text-blue-600' : 'text-red-600'
                                            }`}
                                    >
                                        {r.impact.toFixed(3)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center text-gray-500">
                        No LIME data available for this prediction.
                    </p>
                )}
                <p className="text-xs text-gray-500 text-center mt-2">
                    Positive impacts (blue) push toward higher risk; negative (red) push
                    lower. Values apply only to your specific input.
                </p>
            </div>

            {/* navigation */}
            <div className="flex flex-wrap justify-center gap-4">
                <NavLink
                    to={`/predict/${id}/result`}
                    className="px-5 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                    Back to Result
                </NavLink>
                <NavLink
                    to={`/predict/${id}/recommendations`}
                    className="px-5 py-2 bg-primary text-white rounded hover:bg-primary/90"
                >
                    View Recommendations
                </NavLink>
            </div>
        </div>
    );
}