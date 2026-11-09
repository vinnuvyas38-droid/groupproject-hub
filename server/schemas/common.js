// schemas/common.js
// Shared Zod helpers reused by all other schema files.
// Written for Zod v4 (uses `error:` instead of `required_error:` / `invalid_type_error:`).

const { z } = require('zod');

// A valid MongoDB ObjectId is exactly 24 hexadecimal characters (0-9, a-f).
// We use this for every :projectId, :memberId, etc. in URL params.
const objectId = z
  .string({ error: 'ID must be a string' })
  .length(24, 'ID must be a 24-character hex string')
  .regex(/^[0-9a-fA-F]{24}$/, 'ID must be a valid MongoDB ObjectId');

// Validates { projectId } from URL params
const projectParamsSchema = z.object({
  projectId: objectId,
});

// Validates { projectId, <itemKey> } from URL params
// e.g. projectAndItemParamsSchema('memberId') → { projectId, memberId }
const projectAndItemParamsSchema = (itemKey) =>
  z.object({
    projectId: objectId,
    [itemKey]: objectId,
  });

module.exports = { objectId, projectParamsSchema, projectAndItemParamsSchema };
