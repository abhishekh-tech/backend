const mongoose = require('mongoose');
const { COURSE_CATEGORIES } = require('./enums');
const { courseContentSchema } = require('./courseContent');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: COURSE_CATEGORIES,
    },
    author: {
      type: String,
      default: 'Anonymous Teacher',
      trim: true,
    },
    content: {
      type: courseContentSchema,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
