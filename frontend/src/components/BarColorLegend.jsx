export default function BarColorLegend() {
    return (
        <div className="flex gap-6 text-xs justify-center mt-2">
            <span className="flex items-center gap-1">
                <span className="w-3 h-3 inline-block bg-blue-600" /> Increases risk
            </span>
            <span className="flex items-center gap-1">
                <span className="w-3 h-3 inline-block bg-red-600" /> Decreases risk
            </span>
        </div>
    );
}