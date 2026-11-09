// routes/health.js
// A simple endpoint to confirm the server is running.
// GET /api/health  →  { status: "ok" }

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = router;

