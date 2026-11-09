// models/Member.js
// A Member belongs to exactly one project.
// No two members can share the same email within the same project.

const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    // Which project this member belongs to
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',   // tells Mongoose this links to the Project model
      required: [true, 'Project reference is required'],
      index: true,       // index for fast queries like "get all members of project X"
    },

    name: {
      type: String,
      required: [true, 'Member name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,  // store emails in lowercase so "A@b.com" and "a@b.com" are the same
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index: the COMBINATION of project + email must be unique.
// Two different projects CAN have the same email; one project CANNOT.
memberSchema.index({ project: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('Member', memberSchema);
