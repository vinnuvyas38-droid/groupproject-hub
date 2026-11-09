// utils/asyncHandler.js
// A tiny wrapper that catches errors from async route handlers
// and forwards them to Express's central error handler via next(err).
// Without this, an unhandled promise rejection in a controller would crash the process.
//
// Usage: router.get('/path', asyncHandler(async (req, res) => { ... }))

const asyncHandler = (fn) => (req, res, next) => {
  // Run the async function; if it rejects, pass the error to next()
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

