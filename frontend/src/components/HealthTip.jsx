export default function HealthTip({ tip }) {
  if (!tip) return null;

  return (
    <div className="bg-primary text-white rounded-lg p-6 h-full">
      <h3 className="text-lg font-semibold mb-2">Health Tip of the Day</h3>
      <p className="leading-relaxed">{tip}</p>
    </div>
  );
}