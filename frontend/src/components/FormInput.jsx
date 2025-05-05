export function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  step,
  tooltip,
  error,
  unit, // NEW
  disabled = false,
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">
        {label}
        {tooltip && (
          <span className="ml-1 text-xs text-gray-400" title={tooltip}>
            ⓘ
          </span>
        )}
      </label>

      <div className="relative">
        <input
          name={name}
          type={type}
          value={value}
          step={step}
          onChange={onChange}
          disabled={disabled}
          className={`w-full border px-3 py-2 rounded ${unit ? 'pr-16' : ''
            } ${disabled && 'bg-gray-100'}`}
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
            {unit}
          </span>
        )}
      </div>

      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

export function FormSelect({
  label,
  name,
  value,
  onChange,
  options = ["N/A"],
  error,
  disabled = false,
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full border px-3 py-2 rounded ${disabled && 'bg-gray-100'
          }`}
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}