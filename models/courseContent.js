const mongoose = require('mongoose');
const { CONTENT_TYPES } = require('./enums');

/**
 * Embedded document for Course — matches LearnerDashboard usage of
 * content.type, content.mimeType, content.fileName, content.fileSize (fileData omitted in JSON).
 */
const courseContentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: CONTENT_TYPES,
      required: true,
    },
    fileName: { type: String },
    fileSize: { type: Number },
    fileData: { type: Buffer },
    mimeType: { type: String },
  },
  { _id: false }
);

module.exports = { courseContentSchema };
