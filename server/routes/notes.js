// routes/notes.js
// Mounts meeting note CRUD routes under /api/projects/:projectId/notes.

const express = require('express');
const router  = express.Router({ mergeParams: true });

const validate = require('../middleware/validate');
const { createNoteSchema, updateNoteSchema, noteQuerySchema } = require('../schemas/meetingNote');
const { projectParamsSchema, projectAndItemParamsSchema } = require('../schemas/common');

const {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} = require('../controllers/noteController');

// GET  /api/projects/:projectId/notes         — list notes (supports ?search=)
// POST /api/projects/:projectId/notes         — create a note
router.route('/')
  .get(
    validate(projectParamsSchema, 'params'),
    validate(noteQuerySchema, 'query'),   // validate the optional ?search= param
    getNotes
  )
  .post(
    validate(projectParamsSchema, 'params'),
    validate(createNoteSchema),
    createNote
  );

// PUT    /api/projects/:projectId/notes/:noteId  — update a note
// DELETE /api/projects/:projectId/notes/:noteId  — delete a note
router.route('/:noteId')
  .put(
    validate(projectAndItemParamsSchema('noteId'), 'params'),
    validate(updateNoteSchema),
    updateNote
  )
  .delete(
    validate(projectAndItemParamsSchema('noteId'), 'params'),
    deleteNote
  );

module.exports = router;

