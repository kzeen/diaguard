import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Cell,
} from 'recharts';

// Prettify raw keys
const pretty = (k) =>
    k
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

export default function FeatureImportanceChart({ items }) {
    const sums = {};
    items.forEach(([k, v]) => {
        const root = k.startsWith('smoking_history')
            ? 'Smoking History'
            : pretty(k);
        if (!sums[root]) sums[root] = { pos: 0, neg: 0 };
        v > 0 ? (sums[root].pos += v) : (sums[root].neg += v);
    });
    const data = Object.entries(sums).map(([name, { pos, neg }]) => {
        const v = Math.abs(pos || neg);
        const dir = pos >= Math.abs(neg) ? 'pos' : 'neg';
        return {
            name,
            value: v,
            dir,
            fill: dir === 'pos' ? '#2563eb' : '#dc2626',
        };
    });

    return (
        <div className="w-full h-64 overflow-x-auto">
            <ResponsiveContainer>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ left: 10, right: 20, top: 10, bottom: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" hide />
                    <YAxis
                        dataKey="name"
                        type="category"
                        width={150}
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                        formatter={(v, _, d) =>
                            [`${v.toFixed(3)}`, d.payload.dir === 'pos' ? '↑ increases risk' : '↓ reduces risk']
                        }
                    />
                    <Bar dataKey="value" isAnimationActive={false}>
                        {data.map((entry, index) => (
                            <Cell key={index} fill={entry.fill} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}