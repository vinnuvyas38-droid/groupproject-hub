// controllers/projectController.js
// Handles all CRUD for Projects.
// When a project is deleted, ALL of its members, tasks, notes, and milestones
// are deleted too (cascade delete).

const Project     = require('../models/Project');
const Member      = require('../models/Member');
const Task        = require('../models/Task');
const MeetingNote = require('../models/MeetingNote');
const Milestone   = require('../models/Milestone');
const asyncHandler = require('../utils/asyncHandler');

// ── GET /api/projects ─────────────────────────────────────────────────────────
// Returns every project, newest first.
const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json({ success: true, data: projects });
});

// ── POST /api/projects ────────────────────────────────────────────────────────
// Creates a new project. The request body has already been validated by the
// validate() middleware, so we can trust it here.
const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create(req.body);
  res.status(201).json({ success: true, data: project });
});

// ── GET /api/projects/:projectId ──────────────────────────────────────────────
// Returns one project by its id.
const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found.',
      errors: [],
    });
  }

  res.json({ success: true, data: project });
});

// ── PUT /api/projects/:projectId ──────────────────────────────────────────────
// Updates a project's name or description.
const updateProject = asyncHandler(async (req, res) => {
  // findByIdAndUpdate with { new: true } returns the updated document, not the old one
  // runValidators: true makes Mongoose re-run model-level validations
  const project = await Project.findByIdAndUpdate(
    req.params.projectId,
    req.body,
    { new: true, runValidators: true }
  );

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found.',
      errors: [],
    });
  }

  res.json({ success: true, data: project });
});

// ── DELETE /api/projects/:projectId ───────────────────────────────────────────
// Deletes the project AND everything that belongs to it.
const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found.',
      errors: [],
    });
  }

  // Cascade: delete all child documents that reference this project
  await Promise.all([
    Member.deleteMany({ project: projectId }),
    Task.deleteMany({ project: projectId }),
    MeetingNote.deleteMany({ project: projectId }),
    Milestone.deleteMany({ project: projectId }),
  ]);

  // Now delete the project itself
  await Project.findByIdAndDelete(projectId);

  // 204 No Content = "deleted successfully, nothing to return"
  res.status(204).send();
});

module.exports = { getAllProjects, createProject, getProject, updateProject, deleteProject };

