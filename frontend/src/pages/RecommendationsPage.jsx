import { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import {
    fetchPredictionRecs,
    sendRecFeedback,
} from '../services/predictions';
import Spinner from '../components/Spinner';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import toast from 'react-hot-toast';
import usePageTitle from '../hooks/usePageTitle';

const badgeColour = {
    diet: 'bg-emerald-100 text-emerald-700',
    exercise: 'bg-blue-100 text-blue-700',
    habits: 'bg-amber-100 text-amber-700',
};

export default function RecommendationsPage() {
    usePageTitle('Recommendations');

    const { id } = useParams();
    const [groups, setGroups] = useState(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);

    /* ---------- load recs ---------- */
    useEffect(() => {
        async function load() {
            try {
                const data = await fetchPredictionRecs(id);
                setGroups(data);
            } catch (error) {
                setError('Unable to load recommendations.');
                console.error(error)
            }
        }
        load();
    }, [id]);

    /* ---------- feedback ---------- */
    const handleClick = async (recId, helpful) => {
        if (busy) return;
        setBusy(true);
        try {
            await sendRecFeedback(id, recId, helpful)
                .then(() => toast.success('Feedback received!'))
                .catch(() => toast.error('Could not send feedback.'));
            const data = await fetchPredictionRecs(id);
            setGroups(data);
        } finally {
            setBusy(false);
        }
    };

    if (error) return <p className="text-center text-red-600">{error}</p>;
    if (!groups) return <Spinner />;

    return (
        <div className="max-w-3xl mx-auto space-y-10">
            <h2 className="text-3xl font-bold text-center">Recommendations</h2>

            <p className="text-sm text-gray-600 text-center max-w-lg mx-auto">
                Below are personalised tips based on your latest prediction. Let us know
                which ones you actually find useful (
                <ThumbsUp size={14} className="inline" />) or not useful (
                <ThumbsDown size={14} className="inline" />); your feedback helps us
                improve future advice.
            </p>

            {Object.entries(groups).map(([cat, recs]) => (
                <section key={cat} className="space-y-6">
                    {/* category badge */}
                    <h3
                        className={`mx-auto inline-block px-4 py-1 rounded-full font-medium uppercase text-xs tracking-wide ${badgeColour[cat] ?? 'bg-gray-100 text-gray-700'
                            }`}
                    >
                        {cat}
                    </h3>

                    {recs.map((r) => (
                        <div
                            key={r.id}
                            className="bg-white shadow rounded-lg p-6 flex flex-col gap-3"
                        >
                            <p className="text-sm text-center">{r.content}</p>

                            {/* feedback buttons or tag */}
                            <div className="flex gap-3">
                                {r.helpful === null ? (
                                    <>
                                        <button
                                            disabled={busy}
                                            onClick={() => handleClick(r.id, true)}
                                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-600 disabled:opacity-40"
                                        >
                                            <ThumbsUp size={16} /> Helpful
                                        </button>
                                        <button
                                            disabled={busy}
                                            onClick={() => handleClick(r.id, false)}
                                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 disabled:opacity-40"
                                        >
                                            <ThumbsDown size={16} /> Not helpful
                                        </button>
                                    </>
                                ) : (
                                    <span
                                        className={`flex items-center gap-1 text-xs font-medium ${r.helpful ? 'text-green-600' : 'text-red-600'
                                            }`}
                                    >
                                        {r.helpful ? (
                                            <>
                                                <ThumbsUp size={16} /> Marked helpful
                                            </>
                                        ) : (
                                            <>
                                                <ThumbsDown size={16} /> Not helpful
                                            </>
                                        )}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </section>
            ))}

            <p className="text-xs text-gray-500 text-center max-w-md mx-auto">
                Tips are informational only and do not replace professional medical
                advice. Always consult your healthcare provider before making changes to
                your treatment plan.
            </p>

            <div className="text-center">
                <NavLink
                    to={`/predict/${id}/result`}
                    className="px-5 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                    Back to Result
                </NavLink>
            </div>
        </div>
    );
}