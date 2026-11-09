// routes/members.js
// Mounts member CRUD routes under /api/projects/:projectId/members.
// Note: Express mergeParams:true lets us read :projectId from the parent router.

const express = require('express');
const router  = express.Router({ mergeParams: true }); // inherit :projectId from parent

const validate = require('../middleware/validate');
const { createMemberSchema, updateMemberSchema } = require('../schemas/member');
const { projectParamsSchema, projectAndItemParamsSchema } = require('../schemas/common');

const {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
} = require('../controllers/memberController');

// GET  /api/projects/:projectId/members   — list members in this project
// POST /api/projects/:projectId/members   — add a member
router.route('/')
  .get(validate(projectParamsSchema, 'params'), getMembers)
  .post(validate(projectParamsSchema, 'params'), validate(createMemberSchema), createMember);

// PUT    /api/projects/:projectId/members/:memberId  — update member
// DELETE /api/projects/:projectId/members/:memberId  — delete member (cascade)
router.route('/:memberId')
  .put(
    validate(projectAndItemParamsSchema('memberId'), 'params'),
    validate(updateMemberSchema),
    updateMember
  )
  .delete(
    validate(projectAndItemParamsSchema('memberId'), 'params'),
    deleteMember
  );

module.exports = router;

