// routes/tasks.js
// Mounts task CRUD routes under /api/projects/:projectId/tasks.

const express = require('express');
const router  = express.Router({ mergeParams: true });

const validate = require('../middleware/validate');
const { createTaskSchema, updateTaskSchema, taskQuerySchema } = require('../schemas/task');
const { projectParamsSchema, projectAndItemParamsSchema } = require('../schemas/common');

const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

// GET  /api/projects/:projectId/tasks         — list tasks (supports ?status= ?assignedTo=)
// POST /api/projects/:projectId/tasks         — create a task
router.route('/')
  .get(
    validate(projectParamsSchema, 'params'),
    validate(taskQuerySchema, 'query'),   // validate the ?status= and ?assignedTo= filters
    getTasks
  )
  .post(
    validate(projectParamsSchema, 'params'),
    validate(createTaskSchema),
    createTask
  );

// PUT    /api/projects/:projectId/tasks/:taskId  — update a task
// DELETE /api/projects/:projectId/tasks/:taskId  — delete a task
router.route('/:taskId')
  .put(
    validate(projectAndItemParamsSchema('taskId'), 'params'),
    validate(updateTaskSchema),
    updateTask
  )
  .delete(
    validate(projectAndItemParamsSchema('taskId'), 'params'),
    deleteTask
  );

module.exports = router;

