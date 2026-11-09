// routes/milestones.js
// Mounts milestone CRUD routes under /api/projects/:projectId/milestones.

const express = require('express');
const router  = express.Router({ mergeParams: true });

const validate = require('../middleware/validate');
const { createMilestoneSchema, updateMilestoneSchema } = require('../schemas/milestone');
const { projectParamsSchema, projectAndItemParamsSchema } = require('../schemas/common');

const {
  getMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
} = require('../controllers/milestoneController');

// GET  /api/projects/:projectId/milestones          — list milestones
// POST /api/projects/:projectId/milestones          — create a milestone
router.route('/')
  .get(validate(projectParamsSchema, 'params'), getMilestones)
  .post(validate(projectParamsSchema, 'params'), validate(createMilestoneSchema), createMilestone);

// PUT    /api/projects/:projectId/milestones/:milestoneId  — update
// DELETE /api/projects/:projectId/milestones/:milestoneId  — delete
router.route('/:milestoneId')
  .put(
    validate(projectAndItemParamsSchema('milestoneId'), 'params'),
    validate(updateMilestoneSchema),
    updateMilestone
  )
  .delete(
    validate(projectAndItemParamsSchema('milestoneId'), 'params'),
    deleteMilestone
  );

module.exports = router;

