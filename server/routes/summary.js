// routes/summary.js
// GET /api/projects/:projectId/summary/members

const express = require('express');
const router  = express.Router({ mergeParams: true });

const validate    = require('../middleware/validate');
const { projectParamsSchema } = require('../schemas/common');
const { getMemberSummary } = require('../controllers/summaryController');

// The path is /members so the full URL is /api/projects/:projectId/summary/members
router.get('/members', validate(projectParamsSchema, 'params'), getMemberSummary);

module.exports = router;

