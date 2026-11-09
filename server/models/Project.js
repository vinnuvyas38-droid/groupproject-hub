// models/Project.js
// A Project is the top-level workspace — everything else belongs to a project.

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    // The project name: required, trimmed, and 2-80 characters long
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [2, 'Project name must be at least 2 characters'],
      maxlength: [80, 'Project name cannot exceed 80 characters'],
    },

    // An optional description of the project
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    // timestamps: true automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

module.exports = mongoose.model('Project', projectSchema);
