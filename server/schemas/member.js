// schemas/member.js
// Zod v4 validation schemas for the Member resource.

const { z } = require('zod');

// Used when adding a new member (POST /api/projects/:projectId/members)
const createMemberSchema = z.object({
  name: z
    .string({ error: 'Member name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name cannot exceed 60 characters'),

  email: z
    .string({ error: 'Email is required' })
    .trim()
    .toLowerCase()   // normalise before saving so "A@b.com" == "a@b.com"
    .email('Please enter a valid email address'),
});

// Used when updating a member (PUT /api/projects/:projectId/members/:memberId)
const updateMemberSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name cannot exceed 60 characters')
    .optional(),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address')
    .optional(),
});

module.exports = { createMemberSchema, updateMemberSchema };
