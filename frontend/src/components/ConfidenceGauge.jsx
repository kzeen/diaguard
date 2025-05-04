import {
    RadialBarChart,
    RadialBar,
    PolarAngleAxis,
    ResponsiveContainer,
} from 'recharts';

export default function ConfidenceGauge({ confidence }) {
    const pct = Math.round(confidence * 100);      // 0‑100

    return (
        <div className="flex flex-col items-center">
            {/* ring */}
            <div className="relative w-44 h-44">
                <ResponsiveContainer>
                    <RadialBarChart
                        innerRadius="78%"
                        outerRadius="100%"
                        barSize={10}
                        data={[{ value: pct }]}
                        startAngle={90}
                        endAngle={-270}
                    >
                        <PolarAngleAxis
                            type="number"
                            domain={[0, 100]}
                            tick={false}
                        />
                        <RadialBar
                            dataKey="value"
                            cornerRadius={10}
                            background
                            fill="#2563eb"
                        />
                    </RadialBarChart>
                </ResponsiveContainer>

                {/* centred % */}
                <span className="absolute inset-0 flex items-center justify-center text-xl font-bold">
                    {pct}%
                </span>
            </div>

            <p className="text-xs text-gray-500 mt-1">Model confidence</p>
        </div>
    );
}