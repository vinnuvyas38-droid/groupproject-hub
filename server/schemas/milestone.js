// schemas/milestone.js
// Zod v4 validation schemas for the Milestone resource.

const { z } = require('zod');

const MILESTONE_STATUSES = ['Pending', 'In Progress', 'Completed'];

// Used when creating a milestone (POST /api/projects/:projectId/milestones)
const createMilestoneSchema = z.object({
  title: z
    .string({ error: 'Milestone title is required' })
    .trim()
    .min(2, 'Title must be at least 2 characters')
    .max(120, 'Title cannot exceed 120 characters'),

  description: z
    .string()
    .trim()
    .max(500, 'Description cannot exceed 500 characters')
    .optional()
    .default(''),

  // dueDate is required for milestones so the dashboard can show countdowns
  dueDate: z.coerce.date({
    error: 'Due date is required and must be a valid date',
  }),

  status: z
    .enum(MILESTONE_STATUSES, {
      error: 'Status must be: Pending, In Progress, or Completed',
    })
    .default('Pending'),
});

// Used when updating a milestone (PUT /api/projects/:projectId/milestones/:milestoneId)
const updateMilestoneSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Title must be at least 2 characters')
    .max(120, 'Title cannot exceed 120 characters')
    .optional(),

  description: z
    .string()
    .trim()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),

  dueDate: z.coerce.date({ error: 'Due date must be a valid date' }).optional(),

  status: z
    .enum(MILESTONE_STATUSES, {
      error: 'Status must be: Pending, In Progress, or Completed',
    })
    .optional(),
});

module.exports = { createMilestoneSchema, updateMilestoneSchema, MILESTONE_STATUSES };
