// models/MeetingNote.js
// Records what happened in a team meeting.
// attendees is an array of Member ObjectIds (which members were present).

const mongoose = require('mongoose');

const meetingNoteSchema = new mongoose.Schema(
  {
    // Which project this note belongs to
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project reference is required'],
      index: true,
    },

    title: {
      type: String,
      required: [true, 'Note title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },

    // When the meeting took place
    date: {
      type: Date,
      required: [true, 'Meeting date is required'],
    },

    // The body of the notes (what was discussed, decisions made, etc.)
    content: {
      type: String,
      trim: true,
      maxlength: [5000, 'Content cannot exceed 5000 characters'],
      default: '',
    },

    // Which members attended — an array of references to the Member model
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index to support text search on title and content
meetingNoteSchema.index({ project: 1, title: 'text', content: 'text' });

module.exports = mongoose.model('MeetingNote', meetingNoteSchema);
