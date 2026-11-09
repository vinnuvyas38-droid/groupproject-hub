// components/ui/Select.jsx
// A styled dropdown select field with label and error support.

export default function Select({
  label,
  name,
  value,
  onChange,
  options = [],   // array of { value: 'string', label: 'string' }
  error,
  placeholder = 'Select...',
  required = false,
}) {
  const selectClasses = `w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
  }`;

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={selectClasses}
      >
        {/* Empty default option */}
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

