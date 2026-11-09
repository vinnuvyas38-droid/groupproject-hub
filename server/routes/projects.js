// routes/projects.js
// Mounts project CRUD routes.
// URL prefix /api/projects is set in index.js.

const express = require('express');
const router  = express.Router();

const validate = require('../middleware/validate');
const { createProjectSchema, updateProjectSchema } = require('../schemas/project');
const { objectId } = require('../schemas/common');
const { z } = require('zod');

const {
  getAllProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

// Schema for validating :projectId in URL params
const projectIdParamSchema = z.object({ projectId: objectId });

// GET  /api/projects          — list all projects
// POST /api/projects          — create a project
router.route('/')
  .get(getAllProjects)
  .post(validate(createProjectSchema), createProject);

// GET    /api/projects/:projectId  — get one project
// PUT    /api/projects/:projectId  — update it
// DELETE /api/projects/:projectId  — delete it (cascade)
router.route('/:projectId')
  .get(validate(projectIdParamSchema, 'params'), getProject)
  .put(validate(projectIdParamSchema, 'params'), validate(updateProjectSchema), updateProject)
  .delete(validate(projectIdParamSchema, 'params'), deleteProject);

module.exports = router;

