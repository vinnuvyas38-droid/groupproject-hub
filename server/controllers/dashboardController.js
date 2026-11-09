// controllers/dashboardController.js
// Returns a summary overview of a project for the Dashboard page.
//
// Response shape (Section 15):
// {
//   taskCounts: { "To Do": 0, "In Progress": 0, "Done": 0, "total": 0 },
//   overdueCount: 0,
//   upcomingTasks: [ { _id, title, dueDate, assignee } ],      ← next 5
//   upcomingMilestones: [ { _id, title, dueDate, status } ],   ← next 5
//   memberCount: 0,
//   noteCount: 0
// }

const Task        = require('../models/Task');
const Milestone   = require('../models/Milestone');
const Member      = require('../models/Member');
const MeetingNote = require('../models/MeetingNote');
const Project     = require('../models/Project');
const asyncHandler = require('../utils/asyncHandler');
const { startOfToday } = require('../utils/dateHelpers');

const getDashboard = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  // Confirm the project exists first so we give a clean 404 if not
  const project = await Project.findById(projectId).lean();
  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found.',
      errors: [],
    });
  }

  const today = startOfToday();

  // Run all the independent queries in parallel with Promise.all for speed.
  // Each query only fetches the fields it needs (projection) to keep it lean.
  const [
    taskStatusCounts,   // aggregation result: counts grouped by status
    overdueCount,       // number of overdue tasks
    upcomingTasks,      // next 5 tasks due in the future
    upcomingMilestones, // next 5 milestones due in the future
    memberCount,
    noteCount,
  ] = await Promise.all([
    // 1. Count tasks grouped by status using MongoDB aggregation
    Task.aggregate([
      { $match: { project: project._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),

    // 2. Count overdue tasks: dueDate < today AND status != Done
    Task.countDocuments({
      project: projectId,
      status: { $ne: 'Done' },
      dueDate: { $lt: today, $ne: null },
    }),

    // 3. Next 5 upcoming tasks: dueDate >= today, not Done, soonest first
    Task.find({
      project: projectId,
      status: { $ne: 'Done' },
      dueDate: { $gte: today, $ne: null },
    })
      .sort({ dueDate: 1 })
      .limit(5)
      .populate('assignedTo', 'name')
      .lean(),

    // 4. Next 5 upcoming milestones: not Completed, soonest first
    Milestone.find({
      project: projectId,
      status: { $ne: 'Completed' },
      dueDate: { $gte: today },
    })
      .sort({ dueDate: 1 })
      .limit(5)
      .lean(),

    // 5. Total member count for this project
    Member.countDocuments({ project: projectId }),

    // 6. Total note count for this project
    MeetingNote.countDocuments({ project: projectId }),
  ]);

  // Turn the aggregation array into the flat object the spec requires
  // e.g. [ { _id: "To Do", count: 3 }, ... ] → { "To Do": 3, "In Progress": 0, ... }
  const taskCounts = { 'To Do': 0, 'In Progress': 0, 'Done': 0, total: 0 };
  for (const row of taskStatusCounts) {
    if (row._id in taskCounts) {
      taskCounts[row._id] = row.count;
      taskCounts.total += row.count;
    }
  }

  // Shape upcomingTasks to match the spec contract
  const upcomingTasksShaped = upcomingTasks.map((t) => ({
    _id:      t._id,
    title:    t.title,
    dueDate:  t.dueDate ? t.dueDate.toISOString() : null,
    assignee: t.assignedTo ? t.assignedTo.name : null,
  }));

  // Shape upcomingMilestones to match the spec contract
  const upcomingMilestonesShaped = upcomingMilestones.map((m) => ({
    _id:     m._id,
    title:   m.title,
    dueDate: m.dueDate.toISOString(),
    status:  m.status,
  }));

  res.json({
    success: true,
    data: {
      taskCounts,
      overdueCount,
      upcomingTasks:      upcomingTasksShaped,
      upcomingMilestones: upcomingMilestonesShaped,
      memberCount,
      noteCount,
    },
  });
});

module.exports = { getDashboard };

