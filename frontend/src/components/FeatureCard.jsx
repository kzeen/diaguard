// Generic card for the Features section
export default function FeatureCard({ imgSrc, title, desc, ...rest }) {
  return (
    <div {...rest} className="bg-white rounded-lg shadow p-6">
      <img
        src={imgSrc}
        alt={title}
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}