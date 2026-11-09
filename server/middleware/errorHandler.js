// middleware/errorHandler.js
// Central error handler — Express calls this when next(err) is used anywhere.
// It lives AFTER all routes in index.js.
// It prevents stack traces from leaking to the client in production.

const errorHandler = (err, req, res, next) => {
  // Log the full error on the server so we can debug it
  console.error('🔴 Server Error:', err.message);

  // If this is a Mongoose duplicate-key error (e.g. duplicate email in same project)
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'A record with that value already exists.',
      errors: [],
    });
  }

  // If this is a Mongoose CastError (e.g. malformed MongoDB ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid value for field: ${err.path}`,
      errors: [],
    });
  }

  // Use the status code from the error if set, otherwise default to 500
  const statusCode = err.statusCode || 500;

  // In production, don't reveal internal error details
  const message =
    process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'An unexpected error occurred. Please try again later.'
      : err.message || 'An unexpected error occurred.';

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [], // pass through any field-level errors if set
  });
};

module.exports = errorHandler;

