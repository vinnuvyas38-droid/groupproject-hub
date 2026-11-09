// utils/dateHelpers.js
// Small helpers for date calculations used across controllers.

/**
 * Returns midnight (00:00:00.000) at the START of today in local server time.
 * A task is overdue if its dueDate is BEFORE this value and it is not "Done".
 */
function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, milliseconds to zero
  return d;
}

/**
 * Returns true if a task is overdue:
 *   - has a dueDate
 *   - dueDate is before the start of today
 *   - status is not "Done"
 */
function isTaskOverdue(task) {
  if (!task.dueDate) return false;             // No due date = can't be overdue
  if (task.status === 'Done') return false;    // Completed tasks are never overdue
  return new Date(task.dueDate) < startOfToday();
}

module.exports = { startOfToday, isTaskOverdue };

