// schemas/task.js
// Zod v4 validation schemas for the Task resource.

const { z } = require('zod');
const { objectId } = require('./common');

// Status and priority values — must match the Mongoose model exactly
const TASK_STATUSES = ['To Do', 'In Progress', 'Done'];
const TASK_PRIORITIES = ['Low', 'Medium', 'High'];

// Used when creating a new task (POST /api/projects/:projectId/tasks)
const createTaskSchema = z.object({
  title: z
    .string({ error: 'Task title is required' })
    .trim()
    .min(2, 'Title must be at least 2 characters')
    .max(120, 'Title cannot exceed 120 characters'),

  description: z
    .string()
    .trim()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional()
    .default(''),

  // assignedTo is optional — a task can be unassigned (null)
  assignedTo: objectId.nullable().optional().default(null),

  // z.coerce.date() converts a date string like "2025-12-31" into a JS Date object
  dueDate: z.coerce
    .date({ error: 'Due date must be a valid date' })
    .nullable()
    .optional()
    .default(null),

  status: z
    .enum(TASK_STATUSES, {
      error: 'Status must be: To Do, In Progress, or Done',
    })
    .default('To Do'),

  priority: z
    .enum(TASK_PRIORITIES, {
      error: 'Priority must be: Low, Medium, or High',
    })
    .default('Medium'),
});

// Used when updating a task (PUT /api/projects/:projectId/tasks/:taskId)
const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Title must be at least 2 characters')
    .max(120, 'Title cannot exceed 120 characters')
    .optional(),

  description: z
    .string()
    .trim()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional(),

  assignedTo: objectId.nullable().optional(),

  dueDate: z.coerce
    .date({ error: 'Due date must be a valid date' })
    .nullable()
    .optional(),

  status: z
    .enum(TASK_STATUSES, { error: 'Status must be: To Do, In Progress, or Done' })
    .optional(),

  priority: z
    .enum(TASK_PRIORITIES, { error: 'Priority must be: Low, Medium, or High' })
    .optional(),
});

// Validates query string on GET /api/projects/:projectId/tasks
// e.g. ?status=Done&assignedTo=64abc123...
const taskQuerySchema = z.object({
  status: z.enum(TASK_STATUSES, { error: 'Invalid status filter' }).optional(),
  assignedTo: objectId.optional(),
});

module.exports = { createTaskSchema, updateTaskSchema, taskQuerySchema, TASK_STATUSES, TASK_PRIORITIES };
