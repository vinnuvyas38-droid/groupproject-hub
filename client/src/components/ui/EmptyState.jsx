// components/ui/EmptyState.jsx
// Shown when a list (tasks, members, notes, etc.) has no items.
// Includes a helpful message and an optional action button.

import Button from './Button';

export default function EmptyState({
  title = 'No items found',
  message = 'Get started by creating your first item.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="text-center py-12 px-4 bg-white rounded-xl border border-dashed border-gray-300">
      <div className="text-4xl mb-3">📋</div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">{message}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}

