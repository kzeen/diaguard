export default function RiskLegend() {
    return (
        <div className="flex gap-4 text-xs justify-center">
            <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-green-300 inline-block" /> Low
                risk
            </span>
            <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-yellow-300 inline-block" />{' '}
                Medium
            </span>
            <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-red-300 inline-block" /> High
            </span>
        </div>
    );
}