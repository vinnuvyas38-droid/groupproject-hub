// models/Milestone.js
// A Milestone is a significant deadline or deliverable for the project.
// It has its own status separate from tasks.

const mongoose = require('mongoose');

const MILESTONE_STATUSES = ['Pending', 'In Progress', 'Completed'];

const milestoneSchema = new mongoose.Schema(
  {
    // Which project this milestone belongs to
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project reference is required'],
      index: true,
    },

    title: {
      type: String,
      required: [true, 'Milestone title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },

    // When this milestone must be reached — required for the dashboard countdown
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },

    // Current state of the milestone
    status: {
      type: String,
      enum: {
        values: MILESTONE_STATUSES,
        message: 'Status must be one of: Pending, In Progress, Completed',
      },
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

// Export allowed values for use in Zod schemas
milestoneSchema.statics.STATUSES = MILESTONE_STATUSES;

module.exports = mongoose.model('Milestone', milestoneSchema);
