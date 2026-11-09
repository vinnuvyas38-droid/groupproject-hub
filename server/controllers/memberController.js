// controllers/memberController.js
// Handles CRUD for Members inside a project.
// When a member is deleted:
//   - Tasks assigned to them have assignedTo set to null
//   - They are removed from the attendees list of any meeting notes

const Member      = require('../models/Member');
const Task        = require('../models/Task');
const MeetingNote = require('../models/MeetingNote');
const asyncHandler = require('../utils/asyncHandler');

// Helper: check that the project exists (we pass the already-validated projectId
// from params, so if the project was deleted mid-session this returns 404 cleanly)
async function assertProjectMember(projectId, memberId) {
  const member = await Member.findOne({ _id: memberId, project: projectId });
  return member; // null if not found or belongs to a different project
}

// ── GET /api/projects/:projectId/members ──────────────────────────────────────
const getMembers = asyncHandler(async (req, res) => {
  const members = await Member.find({ project: req.params.projectId }).sort({ name: 1 });
  res.json({ success: true, data: members });
});

// ── POST /api/projects/:projectId/members ─────────────────────────────────────
const createMember = asyncHandler(async (req, res) => {
  // The project id comes from the URL — never from the body — to prevent spoofing
  const member = await Member.create({
    ...req.body,
    project: req.params.projectId,
  });

  res.status(201).json({ success: true, data: member });
  // Note: if the email is already in this project, Mongoose throws a duplicate key
  // error (code 11000) which the central errorHandler catches and returns 409.
});

// ── PUT /api/projects/:projectId/members/:memberId ────────────────────────────
const updateMember = asyncHandler(async (req, res) => {
  const { projectId, memberId } = req.params;

  // Make sure the member actually belongs to this project
  const member = await Member.findOneAndUpdate(
    { _id: memberId, project: projectId }, // filter: must match BOTH ids
    req.body,
    { new: true, runValidators: true }
  );

  if (!member) {
    return res.status(404).json({
      success: false,
      message: 'Member not found in this project.',
      errors: [],
    });
  }

  res.json({ success: true, data: member });
});

// ── DELETE /api/projects/:projectId/members/:memberId ─────────────────────────
const deleteMember = asyncHandler(async (req, res) => {
  const { projectId, memberId } = req.params;

  // Verify the member belongs to this project before deleting
  const member = await Member.findOne({ _id: memberId, project: projectId });
  if (!member) {
    return res.status(404).json({
      success: false,
      message: 'Member not found in this project.',
      errors: [],
    });
  }

  // Cascade 1: set assignedTo = null on any tasks assigned to this member
  await Task.updateMany(
    { project: projectId, assignedTo: memberId },
    { $set: { assignedTo: null } }
  );

  // Cascade 2: pull this member id out of all note attendee arrays
  await MeetingNote.updateMany(
    { project: projectId, attendees: memberId },
    { $pull: { attendees: memberId } }
  );

  // Now safe to delete the member
  await Member.findByIdAndDelete(memberId);

  res.status(204).send();
});

module.exports = { getMembers, createMember, updateMember, deleteMember };

