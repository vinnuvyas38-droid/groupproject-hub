// middleware/notFound.js
// Catches any request that did not match a registered route.
// Must be placed AFTER all routes in index.js.

const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    errors: [],
  });
};

module.exports = notFound;

