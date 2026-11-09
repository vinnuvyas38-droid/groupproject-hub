// schemas/meetingNote.js
// Zod v4 validation schemas for the MeetingNote resource.

const { z } = require('zod');
const { objectId } = require('./common');

// Used when creating a note (POST /api/projects/:projectId/notes)
const createNoteSchema = z.object({
  title: z
    .string({ error: 'Note title is required' })
    .trim()
    .min(2, 'Title must be at least 2 characters')
    .max(120, 'Title cannot exceed 120 characters'),

  // Required: when did the meeting happen?
  date: z.coerce.date({ error: 'Meeting date is required and must be a valid date' }),

  content: z
    .string()
    .trim()
    .max(5000, 'Content cannot exceed 5000 characters')
    .optional()
    .default(''),

  // attendees is an array of Member ObjectIds — can be empty
  attendees: z
    .array(objectId, { error: 'Attendees must be an array of member IDs' })
    .optional()
    .default([]),
});

// Used when updating a note (PUT /api/projects/:projectId/notes/:noteId)
const updateNoteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Title must be at least 2 characters')
    .max(120, 'Title cannot exceed 120 characters')
    .optional(),

  date: z.coerce.date({ error: 'Date must be a valid date' }).optional(),

  content: z
    .string()
    .trim()
    .max(5000, 'Content cannot exceed 5000 characters')
    .optional(),

  attendees: z
    .array(objectId, { error: 'Attendees must be an array of member IDs' })
    .optional(),
});

// Validates ?search= on GET /api/projects/:projectId/notes
const noteQuerySchema = z.object({
  // The search term is optional and capped at 200 chars to avoid regex abuse
  search: z.string().trim().max(200, 'Search term cannot exceed 200 characters').optional(),
});

module.exports = { createNoteSchema, updateNoteSchema, noteQuerySchema };
