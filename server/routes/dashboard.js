// routes/dashboard.js
// GET /api/projects/:projectId/dashboard

const express = require('express');
const router  = express.Router({ mergeParams: true });

const validate    = require('../middleware/validate');
const { projectParamsSchema } = require('../schemas/common');
const { getDashboard } = require('../controllers/dashboardController');

router.get('/', validate(projectParamsSchema, 'params'), getDashboard);

module.exports = router;

