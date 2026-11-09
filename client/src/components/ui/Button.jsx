// components/ui/Button.jsx
// A reusable button with different style variants (primary, danger, secondary).
// Handles loading state automatically (disabled + spinner text).

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  onClick,
  disabled = false,
  loading = false,
  className = '',
}) {
  // Base styles shared by all buttons
  const base = 'inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  // Variant-specific colours
  const variants = {
    primary:   'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    danger:    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    success:   'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
    >
      {/* Show a simple spinner text when loading */}
      {loading ? 'Saving...' : children}
    </button>
  );
}

