// utils/validators.js
// Client-side validation helpers.
// These mirror the server's Zod rules exactly so the user gets instant
// feedback in the browser, BEFORE the form is submitted.
//
// Each function returns an errors object: { fieldName: "error message" }
// An empty object means "no errors — form is valid".

// ── Helpers ──────────────────────────────────────────────────────────────────

// Simple email regex — matches the same addresses Zod's .email() accepts
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Check if a string is a valid date (not "banana", not "Invalid Date")
function isValidDate(str) {
  if (!str) return false;
  const d = new Date(str);
  return !isNaN(d.getTime());
}

// ── Project validation ──────────────────────────────────────────────────────
export function validateProject(data) {
  const errors = {};
  const name = (data.name || '').trim();

  if (!name) {
    errors.name = 'Project name is required.';
  } else if (name.length < 2) {
    errors.name = 'Project name must be at least 2 characters.';
  } else if (name.length > 80) {
    errors.name = 'Project name cannot exceed 80 characters.';
  }

  if (data.description && data.description.length > 500) {
    errors.description = 'Description cannot exceed 500 characters.';
  }

  return errors;
}

// ── Member validation ───────────────────────────────────────────────────────
export function validateMember(data) {
  const errors = {};
  const name = (data.name || '').trim();
  const email = (data.email || '').trim();

  if (!name) {
    errors.name = 'Name is required.';
  } else if (name.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  } else if (name.length > 60) {
    errors.name = 'Name cannot exceed 60 characters.';
  }

  if (!email) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_RE.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  return errors;
}

// ── Task validation ─────────────────────────────────────────────────────────
const TASK_STATUSES  = ['To Do', 'In Progress', 'Done'];
const TASK_PRIORITIES = ['Low', 'Medium', 'High'];

export function validateTask(data) {
  const errors = {};
  const title = (data.title || '').trim();

  if (!title) {
    errors.title = 'Task title is required.';
  } else if (title.length < 2) {
    errors.title = 'Title must be at least 2 characters.';
  } else if (title.length > 120) {
    errors.title = 'Title cannot exceed 120 characters.';
  }

  if (data.description && data.description.length > 1000) {
    errors.description = 'Description cannot exceed 1000 characters.';
  }

  if (data.dueDate && !isValidDate(data.dueDate)) {
    errors.dueDate = 'Please enter a valid date.';
  }

  if (data.status && !TASK_STATUSES.includes(data.status)) {
    errors.status = 'Status must be: To Do, In Progress, or Done.';
  }

  if (data.priority && !TASK_PRIORITIES.includes(data.priority)) {
    errors.priority = 'Priority must be: Low, Medium, or High.';
  }

  return errors;
}

// ── Meeting Note validation ─────────────────────────────────────────────────
export function validateNote(data) {
  const errors = {};
  const title = (data.title || '').trim();

  if (!title) {
    errors.title = 'Note title is required.';
  } else if (title.length < 2) {
    errors.title = 'Title must be at least 2 characters.';
  } else if (title.length > 120) {
    errors.title = 'Title cannot exceed 120 characters.';
  }

  if (!data.date) {
    errors.date = 'Meeting date is required.';
  } else if (!isValidDate(data.date)) {
    errors.date = 'Please enter a valid date.';
  }

  if (data.content && data.content.length > 5000) {
    errors.content = 'Content cannot exceed 5000 characters.';
  }

  return errors;
}

// ── Milestone validation ────────────────────────────────────────────────────
const MILESTONE_STATUSES = ['Pending', 'In Progress', 'Completed'];

export function validateMilestone(data) {
  const errors = {};
  const title = (data.title || '').trim();

  if (!title) {
    errors.title = 'Milestone title is required.';
  } else if (title.length < 2) {
    errors.title = 'Title must be at least 2 characters.';
  } else if (title.length > 120) {
    errors.title = 'Title cannot exceed 120 characters.';
  }

  if (data.description && data.description.length > 500) {
    errors.description = 'Description cannot exceed 500 characters.';
  }

  if (!data.dueDate) {
    errors.dueDate = 'Due date is required.';
  } else if (!isValidDate(data.dueDate)) {
    errors.dueDate = 'Please enter a valid date.';
  }

  if (data.status && !MILESTONE_STATUSES.includes(data.status)) {
    errors.status = 'Status must be: Pending, In Progress, or Completed.';
  }

  return errors;
}

// Export the enum arrays so dropdowns can use them
export { TASK_STATUSES, TASK_PRIORITIES, MILESTONE_STATUSES };

