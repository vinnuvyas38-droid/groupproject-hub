// components/ui/ErrorMessage.jsx
// Displays a friendly banner when an API call or operation fails.
// Can show the main message and optional field-level bullet points.

export default function ErrorMessage({ message, errors = [], onRetry }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="p-4 mb-4 text-sm text-red-800 bg-red-50 rounded-lg border border-red-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Error:</span>
          <span>{message}</span>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-xs font-semibold text-red-700 underline hover:text-red-900 ml-3"
          >
            Retry
          </button>
        )}
      </div>

      {errors.length > 0 && (
        <ul className="mt-2 list-disc list-inside space-y-1 text-xs">
          {errors.map((err, i) => (
            <li key={i}>
              <strong className="capitalize">{err.field}</strong>: {err.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

