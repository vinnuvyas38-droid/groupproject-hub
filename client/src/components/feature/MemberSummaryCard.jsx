// components/feature/MemberSummaryCard.jsx
// Complete Member Accountability Card (the key differentiator).
// Displays member details, completion rate progress bar, completed tasks,
// and outstanding commitments with overdue tasks sorted first in red.

import ProgressBar from '../ui/ProgressBar';

export default function MemberSummaryCard({ memberData }) {
  const {
    member,
    totalTasks,
    completedCount,
    outstandingCount,
    overdueCount,
    completionRate,
    completedTasks = [],
    outstandingTasks = [],
  } = memberData;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between transition-all hover:shadow-md">
      <div>
        {/* Header: Member identity & quick badge */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-base shrink-0">
              {member.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-base">{member.name}</h3>
              <p className="text-xs text-gray-400">{member.email}</p>
            </div>
          </div>

          {overdueCount > 0 ? (
            <span className="bg-red-100 text-red-700 text-xs px-2.5 py-1 rounded-full font-bold">
              {overdueCount} Overdue
            </span>
          ) : (
            <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-medium">
              On Track
            </span>
          )}
        </div>

        {/* Progress & Stat Metrics */}
        <div className="mb-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-gray-600">
            <span>Progress: {completedCount} / {totalTasks} Tasks</span>
            <span className="font-bold text-gray-800">{completionRate}%</span>
          </div>
          <ProgressBar percent={completionRate} />
        </div>

        {/* Outstanding Tasks Section */}
        <div className="mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center justify-between">
            <span>Outstanding Commitments</span>
            <span className="text-gray-400 font-normal">({outstandingCount})</span>
          </h4>

          {outstandingTasks.length === 0 ? (
            <p className="text-xs text-gray-400 italic py-2">
              All assigned tasks completed! 🎉
            </p>
          ) : (
            <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {outstandingTasks.map((task) => (
                <li
                  key={task._id}
                  className={`text-xs p-2 rounded-md border flex items-center justify-between gap-2 ${
                    task.isOverdue
                      ? 'bg-red-50/80 border-red-200 text-red-900 font-medium'
                      : 'bg-gray-50 border-gray-100 text-gray-700'
                  }`}
                >
                  <span className="truncate flex-1" title={task.title}>
                    {task.isOverdue && '⚠️ '}
                    {task.title}
                  </span>
                  <span
                    className={`shrink-0 font-semibold text-[11px] ${
                      task.isOverdue ? 'text-red-700' : 'text-gray-500'
                    }`}
                  >
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : 'No date'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Completed Tasks Section */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center justify-between">
            <span>Completed Tasks</span>
            <span className="text-gray-400 font-normal">({completedCount})</span>
          </h4>

          {completedTasks.length === 0 ? (
            <p className="text-xs text-gray-400 italic py-1">No completed tasks yet.</p>
          ) : (
            <ul className="space-y-1 max-h-36 overflow-y-auto pr-1">
              {completedTasks.map((task) => (
                <li
                  key={task._id}
                  className="text-xs text-gray-500 flex items-center gap-1.5 line-through truncate py-0.5"
                  title={task.title}
                >
                  <span className="text-green-600 font-bold no-underline">✓</span>
                  <span className="truncate">{task.title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

