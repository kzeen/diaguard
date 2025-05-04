export default function RiskBadge({ level }) {
  const norm = ['low', 'medium', 'high'][Number(level)] || level.toString().toLowerCase();

  const map = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
  };

  const cls = map[norm] ?? 'bg-gray-100 text-gray-700';
  return (
    <span className={`px-4 py-1 rounded-full font-medium ${cls}`}>
      {norm.toUpperCase()}
    </span>
  );
}