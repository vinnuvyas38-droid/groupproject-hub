// controllers/noteController.js
// Handles CRUD for Meeting Notes inside a project.
// Cross-project check: every attendee id must belong to the same project.
// Text search: the ?search= query does a case-insensitive regex on title and content.

const MeetingNote = require('../models/MeetingNote');
const Member      = require('../models/Member');
const asyncHandler = require('../utils/asyncHandler');

// Helper: check that every attendee id belongs to the given project.
// Returns the first invalid id, or null if all are valid.
async function findInvalidAttendee(attendeeIds, projectId) {
  for (const id of attendeeIds) {
    const exists = await Member.exists({ _id: id, project: projectId });
    if (!exists) return id;
  }
  return null;
}

// ── GET /api/projects/:projectId/notes ────────────────────────────────────────
// Optional query: ?search=keyword  (case-insensitive match on title or content)
const getNotes = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { search } = req.query; // already validated and sanitised by validate middleware

  const filter = { project: projectId };

  if (search) {
    // Escape any regex special characters in the user's search string
    // so "c++" or "c$" don't break the query
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [
      { title:   { $regex: escaped, $options: 'i' } },
      { content: { $regex: escaped, $options: 'i' } },
    ];
  }

  const notes = await MeetingNote.find(filter)
    .populate('attendees', 'name email')
    .sort({ date: -1 }); // newest meeting first

  res.json({ success: true, data: notes });
});

// ── POST /api/projects/:projectId/notes ───────────────────────────────────────
const createNote = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { attendees = [] } = req.body;

  // Cross-project check: all attendee ids must belong to this project
  const badId = await findInvalidAttendee(attendees, projectId);
  if (badId) {
    return res.status(400).json({
      success: false,
      message: 'One or more attendees do not belong to this project.',
      errors: [{ field: 'attendees', message: `Member ID ${badId} not found in this project` }],
    });
  }

  const note = await MeetingNote.create({ ...req.body, project: projectId });
  await note.populate('attendees', 'name email');

  res.status(201).json({ success: true, data: note });
});

// ── PUT /api/projects/:projectId/notes/:noteId ────────────────────────────────
const updateNote = asyncHandler(async (req, res) => {
  const { projectId, noteId } = req.params;
  const { attendees } = req.body;

  // Cross-project check only if attendees are being updated
  if (attendees && attendees.length > 0) {
    const badId = await findInvalidAttendee(attendees, projectId);
    if (badId) {
      return res.status(400).json({
        success: false,
        message: 'One or more attendees do not belong to this project.',
        errors: [{ field: 'attendees', message: `Member ID ${badId} not found in this project` }],
      });
    }
  }

  const note = await MeetingNote.findOneAndUpdate(
    { _id: noteId, project: projectId },
    req.body,
    { new: true, runValidators: true }
  ).populate('attendees', 'name email');

  if (!note) {
    return res.status(404).json({
      success: false,
      message: 'Meeting note not found in this project.',
      errors: [],
    });
  }

  res.json({ success: true, data: note });
});

// ── DELETE /api/projects/:projectId/notes/:noteId ─────────────────────────────
const deleteNote = asyncHandler(async (req, res) => {
  const { projectId, noteId } = req.params;

  const note = await MeetingNote.findOneAndDelete({ _id: noteId, project: projectId });

  if (!note) {
    return res.status(404).json({
      success: false,
      message: 'Meeting note not found in this project.',
      errors: [],
    });
  }

  res.status(204).send();
});

module.exports = { getNotes, createNote, updateNote, deleteNote };

