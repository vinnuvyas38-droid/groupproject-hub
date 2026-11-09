// models/Task.js
// A Task belongs to a project and can optionally be assigned to one member.
// Status drives the dashboard and Member Summary pages.

const mongoose = require('mongoose');

const TASK_STATUSES = ['To Do', 'In Progress', 'Done'];
const TASK_PRIORITIES = ['Low', 'Medium', 'High'];

const taskSchema = new mongoose.Schema(
  {
    // Which project owns this task
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project reference is required'],
      index: true,
    },

    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },

    // Which member this task is assigned to (null = unassigned)
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      default: null,
    },

    // Optional due date — used to calculate overdue status
    dueDate: {
      type: Date,
      default: null,
    },

    // The workflow state of the task
    status: {
      type: String,
      enum: {
        values: TASK_STATUSES,
        message: 'Status must be one of: To Do, In Progress, Done',
      },
      default: 'To Do',
    },

    // How important this task is
    priority: {
      type: String,
      enum: {
        values: TASK_PRIORITIES,
        message: 'Priority must be one of: Low, Medium, High',
      },
      default: 'Medium',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for the two most common filter combinations
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ project: 1, assignedTo: 1 });

// Export the allowed values so other files (e.g. Zod schemas) can import them
taskSchema.statics.STATUSES = TASK_STATUSES;
taskSchema.statics.PRIORITIES = TASK_PRIORITIES;

module.exports = mongoose.model('Task', taskSchema);
