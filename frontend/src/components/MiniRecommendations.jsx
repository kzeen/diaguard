const badgeColor = {
    diet: 'bg-emerald-100 text-emerald-700',
    exercise: 'bg-blue-100 text-blue-700',
    habits: 'bg-amber-100 text-amber-700',
};

export default function MiniRecommendations({ recs = [] }) {
    const top = recs.slice(0, 2);
    if (!top.length) return null;

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h3 className="font-semibold mb-4 text-center">Quick tips</h3>

            <ul className="space-y-3">
                {top.map((r) => (
                    <li key={r.id} className="flex items-start gap-3">
                        <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${badgeColor[r.category] ?? 'bg-gray-100 text-gray-700'
                                }`}
                        >
                            {r.category.toUpperCase()}
                        </span>
                        <p className="text-sm leading-relaxed">{r.content}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}