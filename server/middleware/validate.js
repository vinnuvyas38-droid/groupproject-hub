// middleware/validate.js
// A reusable middleware factory.
// Usage: router.post('/route', validate(myZodSchema), controller)
// It runs the Zod schema against the request body (or params/query).
// If validation fails it sends a 400 response with field-level error messages.
// If it passes, it replaces req.body with the cleaned (stripped) data.

const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    // source can be 'body', 'params', or 'query'
    const data = req[source];

    // .safeParse() tries to parse without throwing — it returns { success, data, error }
    const result = schema.safeParse(data);

    if (!result.success) {
      // Turn Zod's error list into our standard field-level error array
      // Note: Zod v4 uses .issues (not .errors)
      const errors = result.error.issues.map((e) => ({
        field: e.path.join('.') || 'unknown',
        message: e.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed. Please check your input.',
        errors,
      });
    }

    // Replace the original data with Zod's cleaned output (strips unknown fields)
    req[source] = result.data;
    next(); // All good — move to the next middleware or controller
  };
};

module.exports = validate;

