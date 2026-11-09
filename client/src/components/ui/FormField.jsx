// components/ui/FormField.jsx
// A labelled input field that shows inline error text below it.
// Works for text, email, date, and textarea inputs.

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,           // error message string — if truthy, shows in red below the input
  placeholder = '',
  required = false,
  rows = 3,        // only used if type === 'textarea'
}) {
  // Shared input styles
  const inputClasses = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
  }`;

  return (
    <div className="mb-4">
      {/* Label */}
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Render a textarea or a regular input based on type */}
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className={inputClasses}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClasses}
        />
      )}

      {/* Inline error text — only appears when there's an error */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

