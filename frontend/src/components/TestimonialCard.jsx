export default function TestimonialCard({ quote, name, result, img, ...rest }) {
  return (
    <div
      {...rest}
      className="bg-light p-6 rounded-lg shadow flex flex-col items-center text-center"
    >
      <img
        src={img}
        alt={name}
        className="w-16 h-16 rounded-full object-cover mb-4"
      />
      <p className="italic text-gray-700 mb-3">“{quote}”</p>
      <p className="font-semibold">{name}</p>
      <span className="text-sm text-primary">{result}</span>
    </div>
  );
}