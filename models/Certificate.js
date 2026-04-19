const mongoose = require('mongoose');
const { CERTIFICATE_STATUSES } = require('./enums');

/**
 * Issued when a learner completes a course (typically enrollment.status === 'completed').
 * One certificate per enrollment.
 */
const certificateSchema = new mongoose.Schema(
  {
    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enrollment',
      required: true,
      unique: true,
    },
    credentialId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    courseTitleSnapshot: {
      type: String,
      trim: true,
    },
    issuerLabel: {
      type: String,
      trim: true,
    },
    pdfUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: CERTIFICATE_STATUSES,
      default: 'active',
    },
  },
  { timestamps: true }
);

certificateSchema.index({ learner: 1, createdAt: -1 });

module.exports = mongoose.model('Certificate', certificateSchema);
