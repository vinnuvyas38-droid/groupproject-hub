// components/feature/TaskList.jsx
// Displays tasks with status tags, priority, assignee, due date, and overdue indicators.

import Badge from '../ui/Badge';

export default function TaskList({ tasks, onEdit, onDelete, onStatusChange }) {
  const isOverdue = (task) => {
    if (!task.dueDate || task.status === 'Done') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(task.dueDate) < today;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tasks.map((task) => {
        const overdue = isOverdue(task);

        return (
          <div
            key={task._id}
            className={`bg-white rounded-xl shadow-sm border p-5 flex flex-col justify-between transition-all hover:shadow-md ${
              overdue
                ? 'border-red-300 ring-1 ring-red-400 bg-red-50/20'
                : 'border-gray-200'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-base text-gray-900 leading-snug">
                  {task.title}
                </h3>
                <div className="flex items-center gap-1 shrink-0">
                  <Badge value={task.priority} type="priority" />
                  <Badge value={task.status} type="status" />
                </div>
              </div>

              {task.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {task.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  👤 {task.assignedTo ? task.assignedTo.name : <em className="text-gray-400">Unassigned</em>}
                </span>

                {task.dueDate && (
                  <span className={`flex items-center gap-1 font-medium ${overdue ? 'text-red-600 font-bold' : ''}`}>
                    📅 {new Date(task.dueDate).toLocaleDateString()}
                    {overdue && ' (OVERDUE)'}
                  </span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
              <select
                value={task.status}
                onChange={(e) => onStatusChange(task, e.target.value)}
                className="text-xs bg-gray-50 border border-gray-300 rounded px-2 py-1 text-gray-700 font-medium focus:ring-1 focus:ring-blue-500"
                aria-label="Change status"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(task)}
                  className="px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(task)}
                  className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

