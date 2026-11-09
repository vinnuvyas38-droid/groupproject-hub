// schemas/project.js
// Zod v4 validation schemas for the Project resource.
// Rules mirror Section 9 of the master spec exactly.

const { z } = require('zod');

// Used when creating a new project (POST /api/projects)
const createProjectSchema = z.object({
  name: z
    .string({ error: 'Project name is required' })
    .trim()
    .min(2, 'Project name must be at least 2 characters')
    .max(80, 'Project name cannot exceed 80 characters'),

  description: z
    .string()
    .trim()
    .max(500, 'Description cannot exceed 500 characters')
    .optional()
    .default(''),
});

// Used when updating a project (PUT /api/projects/:projectId)
// All fields are optional so the client can patch just one field at a time
const updateProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Project name must be at least 2 characters')
    .max(80, 'Project name cannot exceed 80 characters')
    .optional(),

  description: z
    .string()
    .trim()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
});

module.exports = { createProjectSchema, updateProjectSchema };
