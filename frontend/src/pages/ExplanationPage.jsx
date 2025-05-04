import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPredictionExplanation } from '../services/predictions';
import Spinner from '../components/Spinner';

export default function ExplanationPage() {
    const { id } = useParams();
    const [exp, setExp] = useState(null);

    useEffect(() => {
        fetchPredictionExplanation(id).then(setExp);
    }, [id]);

    if (!exp) return <Spinner />;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-center">Explanation</h2>

            <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
                <h3 className="font-semibold mb-2">SHAP values (JSON)</h3>
                <pre className="text-xs bg-gray-50 p-3 rounded">
                    {JSON.stringify(exp.shap_values, null, 2)}
                </pre>
            </div>

            <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
                <h3 className="font-semibold mb-2">LIME summary</h3>
                <pre className="text-xs bg-gray-50 p-3 rounded">
                    {JSON.stringify(exp.lime_summary, null, 2)}
                </pre>
            </div>
        </div>
    );
}