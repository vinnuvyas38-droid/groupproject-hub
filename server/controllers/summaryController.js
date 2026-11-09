// controllers/summaryController.js
// Builds the Member Summary — the differentiating feature.
//
// Algorithm (Section 14):
//   1. Fetch the project (404 if gone).
//   2. Fetch all members of the project.
//   3. Fetch ALL tasks of the project in ONE query.
//   4. Group tasks by assignedTo in memory — O(tasks) not O(members × tasks).
//   5. For each member compute: completed, outstanding, overdue counts, rate, lists.
//   6. Also emit an "unassigned" bucket for tasks with assignedTo === null.
//
// Response shape (Section 15):
// {
//   project: { _id, name },
//   members: [ { member, totalTasks, completedCount, outstandingCount,
//                overdueCount, completionRate, completedTasks, outstandingTasks } ],
//   unassigned: { outstandingCount, outstandingTasks }
// }

const Project     = require('../models/Project');
const Member      = require('../models/Member');
const Task        = require('../models/Task');
const asyncHandler = require('../utils/asyncHandler');
const { startOfToday, isTaskOverdue } = require('../utils/dateHelpers');

const getMemberSummary = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  // ── 1. Confirm the project exists ─────────────────────────────────────────
  const project = await Project.findById(projectId).lean();
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found.', errors: [] });
  }

  // ── 2 & 3. Fetch members and all tasks in parallel ─────────────────────────
  const [members, allTasks] = await Promise.all([
    Member.find({ project: projectId }).sort({ name: 1 }).lean(),
    Task.find({ project: projectId }).lean(),   // ONE query, all tasks
  ]);

  const today = startOfToday();

  // ── 4. Group tasks by assignedTo in memory ────────────────────────────────
  // Build a Map: memberId (string) → { completed: [], outstanding: [] }
  const taskMap = new Map();

  // Pre-seed the map with an entry for every member (so members with zero tasks appear)
  for (const member of members) {
    taskMap.set(String(member._id), { completed: [], outstanding: [] });
  }

  // Also create a special bucket for unassigned tasks
  const unassignedBucket = { outstanding: [] };

  for (const task of allTasks) {
    const overdue = isTaskOverdue(task);
    const shaped  = shapeTask(task, overdue);

    if (!task.assignedTo) {
      // Task has no assignee — goes in the unassigned bucket
      if (task.status !== 'Done') unassignedBucket.outstanding.push(shaped);
    } else {
      const key = String(task.assignedTo);
      if (!taskMap.has(key)) {
        // This member was deleted after tasks were created — still safe to include
        taskMap.set(key, { completed: [], outstanding: [] });
      }
      const bucket = taskMap.get(key);
      if (task.status === 'Done') {
        bucket.completed.push(shaped);
      } else {
        bucket.outstanding.push(shaped);
      }
    }
  }

  // ── 5. Build the members array with stats ────────────────────────────────
  const membersResult = members.map((member) => {
    const key    = String(member._id);
    const bucket = taskMap.get(key) || { completed: [], outstanding: [] };

    const completedTasks    = bucket.completed;
    const outstandingTasks  = bucket.outstanding;
    const totalTasks        = completedTasks.length + outstandingTasks.length;
    const completedCount    = completedTasks.length;
    const outstandingCount  = outstandingTasks.length;
    const overdueCount      = outstandingTasks.filter((t) => t.isOverdue).length;

    // Completion rate: 0 if no tasks (avoid division by zero)
    const completionRate    = totalTasks > 0
      ? Math.round((completedCount / totalTasks) * 100)
      : 0;

    // Sort outstanding: overdue first, then by dueDate ascending (nulls last)
    const sortedOutstanding = sortOutstandingTasks(outstandingTasks);

    return {
      member: {
        _id:   String(member._id),
        name:  member.name,
        email: member.email,
      },
      totalTasks,
      completedCount,
      outstandingCount,
      overdueCount,
      completionRate,
      completedTasks:   completedTasks.map(shapeResponseTask),
      outstandingTasks: sortedOutstanding.map(shapeResponseTask),
    };
  });

  // ── 6. Shape the unassigned bucket ───────────────────────────────────────
  const sortedUnassigned = sortOutstandingTasks(unassignedBucket.outstanding);

  res.json({
    success: true,
    data: {
      project: { _id: String(project._id), name: project.name },
      members: membersResult,
      unassigned: {
        outstandingCount: sortedUnassigned.length,
        outstandingTasks: sortedUnassigned.map(shapeResponseTask),
      },
    },
  });
});

// ── Helper functions ─────────────────────────────────────────────────────────

// Convert a raw Mongoose task document into a lightweight object for grouping
function shapeTask(task, overdue) {
  return {
    _id:      String(task._id),
    title:    task.title,
    dueDate:  task.dueDate ? task.dueDate.toISOString() : null,
    status:   task.status,
    isOverdue: overdue,
  };
}

// Final shape sent to the client (matches spec contract exactly)
function shapeResponseTask(t) {
  return {
    _id:      t._id,
    title:    t.title,
    dueDate:  t.dueDate,
    status:   t.status,
    isOverdue: t.isOverdue,
  };
}

// Sort outstanding tasks: overdue ones first, then by dueDate ascending, nulls last
function sortOutstandingTasks(tasks) {
  return [...tasks].sort((a, b) => {
    // Overdue tasks always bubble to the top
    if (a.isOverdue !== b.isOverdue) return a.isOverdue ? -1 : 1;

    // Both overdue or both not overdue: sort by dueDate ascending
    if (!a.dueDate && !b.dueDate) return 0;   // both have no date — equal
    if (!a.dueDate) return 1;                  // no date goes to end
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate); // earlier date first
  });
}

module.exports = { getMemberSummary };

