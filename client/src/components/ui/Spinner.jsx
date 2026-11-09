// components/ui/Spinner.jsx
// A simple CSS loading spinner with accessible text.

export default function Spinner({ size = 'md' }) {
  // Size variants
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex items-center justify-center p-4" role="status">
      <div
        className={`${sizes[size] || sizes.md} border-blue-600 border-t-transparent rounded-full animate-spin`}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

