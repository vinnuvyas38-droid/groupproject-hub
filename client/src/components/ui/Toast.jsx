// components/ui/Toast.jsx
// A lightweight notification toast rendered in fixed position.
// Automatically dismisses after duration ms or via close button.

import { useEffect } from 'react';

export default function Toast({
  message,
  type = 'success', // 'success' | 'error' | 'info'
  onClose,
  duration = 3500,
}) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const bg = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-blue-600 text-white',
  }[type] || 'bg-gray-800 text-white';

  return (
    <div
      role="status"
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${bg} transition-all`}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="text-white/80 hover:text-white font-bold text-lg leading-none"
        aria-label="Dismiss notification"
      >
        &times;
      </button>
    </div>
  );
}

