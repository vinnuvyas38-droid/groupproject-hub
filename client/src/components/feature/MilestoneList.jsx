// components/feature/MilestoneList.jsx
// Displays milestones with progress status, target dates, and countdown indicator.

import Badge from '../ui/Badge';

export default function MilestoneList({ milestones, onEdit, onDelete, onStatusChange }) {
  return (
    <div className="space-y-4">
      {milestones.map((ms) => {
        const isPast = new Date(ms.dueDate) < new Date() && ms.status !== 'Completed';

        return (
          <div
            key={ms._id}
            className={`bg-white rounded-xl shadow-sm border p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all hover:shadow-md ${
              isPast ? 'border-red-300 ring-1 ring-red-400 bg-red-50/20' : 'border-gray-200'
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-semibold text-base text-gray-900">{ms.title}</h3>
                <Badge value={ms.status} type="status" />
                {isPast && (
                  <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                    Target Date Passed
                  </span>
                )}
              </div>

              {ms.description && (
                <p className="text-sm text-gray-600 mb-2">{ms.description}</p>
              )}

              <p className="text-xs text-gray-500 font-medium">
                🎯 Target Deadline:{' '}
                <strong className={isPast ? 'text-red-600' : 'text-gray-800'}>
                  {new Date(ms.dueDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </strong>
              </p>
            </div>

            <div className="flex items-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
              <select
                value={ms.status}
                onChange={(e) => onStatusChange(ms, e.target.value)}
                className="text-xs bg-gray-50 border border-gray-300 rounded px-2 py-1 text-gray-700 font-medium focus:ring-1 focus:ring-blue-500"
                aria-label="Change milestone status"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              <button
                onClick={() => onEdit(ms)}
                className="px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(ms)}
                className="px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 rounded font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

