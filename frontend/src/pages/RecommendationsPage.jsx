import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    fetchPredictionRecs,
    sendRecFeedback,
} from '../services/predictions';
import Spinner from '../components/Spinner';

const badge = {
    diet: 'bg-emerald-100 text-emerald-700',
    exercise: 'bg-blue-100 text-blue-700',
    habits: 'bg-amber-100 text-amber-700',
};

export default function RecommendationsPage() {
    const { id } = useParams();
    const [groups, setGroups] = useState(null);
    const [error, setError] = useState(null);
    const [busy, setBusy] = useState(false);

    // fetch once on mount / id change
    useEffect(() => {
        let ignore = false;
        async function load() {
            try {
                const data = await fetchPredictionRecs(id);
                if (!ignore) {
                    setGroups(data);
                    setError(null);
                }
            } catch (e) {
                console.error(e);
                if (!ignore) setError('Failed to load recommendations.');
            }
        }
        load();
        return () => {
            ignore = true;
        };
    }, [id]);

    const toggleHelpful = async (recId, helpful) => {
        setBusy(true);
        try {
            await sendRecFeedback(id, recId, helpful);
            // re‑fetch only the affected category for simplicity
            const data = await fetchPredictionRecs(id);
            setGroups(data);
        } finally {
            setBusy(false);
        }
    };

    if (error) return <p className="text-center text-red-600">{error}</p>;
    if (!groups) return <Spinner />;

    const hasRecs = Object.keys(groups).length;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-center">Recommendations</h2>

            {hasRecs ? (
                Object.entries(groups).map(([category, arr]) => (
                    <div key={category} className="space-y-4">
                        <h3
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${badge[category]
                                }`}
                        >
                            {category.toUpperCase()}
                        </h3>

                        {arr.map((r) => (
                            <div
                                key={r.id}
                                className="bg-white shadow rounded-lg p-4 flex justify-between items-start gap-4"
                            >
                                <p className="text-sm leading-relaxed flex-1">{r.content}</p>

                                {r.helpful === null ? (
                                    <div className="flex flex-col gap-2 shrink-0">
                                        <button
                                            disabled={busy}
                                            onClick={() => toggleHelpful(r.id, true)}
                                            className="px-3 py-1 text-xs bg-green-600 text-white rounded disabled:opacity-50"
                                        >
                                            Helpful
                                        </button>
                                        <button
                                            disabled={busy}
                                            onClick={() => toggleHelpful(r.id, false)}
                                            className="px-3 py-1 text-xs bg-red-600 text-white rounded disabled:opacity-50"
                                        >
                                            Not helpful
                                        </button>
                                    </div>
                                ) : (
                                    <span
                                        className={`px-2 py-0.5 text-xs rounded ${r.helpful
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                            }`}
                                    >
                                        {r.helpful ? 'Marked helpful' : 'Not helpful'}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500">
                    No recommendations were generated for this prediction.
                </p>
            )}
        </div>
    );
}