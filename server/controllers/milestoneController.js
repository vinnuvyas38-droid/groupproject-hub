// controllers/milestoneController.js
// Handles CRUD for Milestones inside a project.
// Milestones have no cross-reference to members, so no cross-project check needed.

const Milestone   = require('../models/Milestone');
const asyncHandler = require('../utils/asyncHandler');

// ── GET /api/projects/:projectId/milestones ───────────────────────────────────
const getMilestones = asyncHandler(async (req, res) => {
  const milestones = await Milestone.find({ project: req.params.projectId })
    .sort({ dueDate: 1 }); // soonest deadline first

  res.json({ success: true, data: milestones });
});

// ── POST /api/projects/:projectId/milestones ──────────────────────────────────
const createMilestone = asyncHandler(async (req, res) => {
  const milestone = await Milestone.create({
    ...req.body,
    project: req.params.projectId,
  });

  res.status(201).json({ success: true, data: milestone });
});

// ── PUT /api/projects/:projectId/milestones/:milestoneId ──────────────────────
const updateMilestone = asyncHandler(async (req, res) => {
  const { projectId, milestoneId } = req.params;

  const milestone = await Milestone.findOneAndUpdate(
    { _id: milestoneId, project: projectId }, // must match BOTH ids
    req.body,
    { new: true, runValidators: true }
  );

  if (!milestone) {
    return res.status(404).json({
      success: false,
      message: 'Milestone not found in this project.',
      errors: [],
    });
  }

  res.json({ success: true, data: milestone });
});

// ── DELETE /api/projects/:projectId/milestones/:milestoneId ───────────────────
const deleteMilestone = asyncHandler(async (req, res) => {
  const { projectId, milestoneId } = req.params;

  const milestone = await Milestone.findOneAndDelete({ _id: milestoneId, project: projectId });

  if (!milestone) {
    return res.status(404).json({
      success: false,
      message: 'Milestone not found in this project.',
      errors: [],
    });
  }

  res.status(204).send();
});

module.exports = { getMilestones, createMilestone, updateMilestone, deleteMilestone };

