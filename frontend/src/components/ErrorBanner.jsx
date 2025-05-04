export default function ErrorBanner({ message }) {
  if (!message) return null;

  const messages = Array.isArray(message) ? message : [message];

  return (
    <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 space-y-1">
      {messages.map((m, idx) => (
        <p key={idx}>{m}</p>
      ))}
    </div>
  );
}
