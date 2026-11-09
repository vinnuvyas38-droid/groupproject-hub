// controllers/taskController.js
// Handles CRUD for Tasks inside a project.
// Cross-project check: if a task is assigned to a member, that member must
// belong to the SAME project. We reject with 400 if not.

const Task        = require('../models/Task');
const Member      = require('../models/Member');
const asyncHandler = require('../utils/asyncHandler');

// Helper: verify that a member id belongs to the given project
async function assertMemberInProject(memberId, projectId) {
  if (!memberId) return true; // null/undefined assignedTo is always fine
  const exists = await Member.exists({ _id: memberId, project: projectId });
  return Boolean(exists);
}

// ── GET /api/projects/:projectId/tasks ────────────────────────────────────────
// Optional query params: ?status=Done  ?assignedTo=<memberId>
const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  // req.query has already been validated and cleaned by the validate middleware
  const { status, assignedTo } = req.query;

  // Build the filter object dynamically — only add a field if the user asked for it
  const filter = { project: projectId };
  if (status)     filter.status = status;
  if (assignedTo) filter.assignedTo = assignedTo;

  const tasks = await Task.find(filter)
    .populate('assignedTo', 'name email') // replace the id with the member's name and email
    .sort({ createdAt: -1 });

  res.json({ success: true, data: tasks });
});

// ── POST /api/projects/:projectId/tasks ───────────────────────────────────────
const createTask = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { assignedTo } = req.body;

  // Cross-project check: if an assignee is provided, make sure they're in this project
  if (assignedTo) {
    const valid = await assertMemberInProject(assignedTo, projectId);
    if (!valid) {
      return res.status(400).json({
        success: false,
        message: 'The assigned member does not belong to this project.',
        errors: [{ field: 'assignedTo', message: 'Member not found in this project' }],
      });
    }
  }

  const task = await Task.create({ ...req.body, project: projectId });

  // Populate the assignedTo field so the response includes member name, not just id
  await task.populate('assignedTo', 'name email');

  res.status(201).json({ success: true, data: task });
});

// ── PUT /api/projects/:projectId/tasks/:taskId ────────────────────────────────
const updateTask = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;
  const { assignedTo } = req.body;

  // Cross-project check for the new assignee (if one is being set)
  if (assignedTo) {
    const valid = await assertMemberInProject(assignedTo, projectId);
    if (!valid) {
      return res.status(400).json({
        success: false,
        message: 'The assigned member does not belong to this project.',
        errors: [{ field: 'assignedTo', message: 'Member not found in this project' }],
      });
    }
  }

  const task = await Task.findOneAndUpdate(
    { _id: taskId, project: projectId }, // must match BOTH to prevent cross-project edits
    req.body,
    { new: true, runValidators: true }
  ).populate('assignedTo', 'name email');

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found in this project.',
      errors: [],
    });
  }

  res.json({ success: true, data: task });
});

// ── DELETE /api/projects/:projectId/tasks/:taskId ─────────────────────────────
const deleteTask = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;

  const task = await Task.findOneAndDelete({ _id: taskId, project: projectId });

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found in this project.',
      errors: [],
    });
  }

  res.status(204).send();
});

module.exports = { getTasks, createTask, updateTask, deleteTask };

