const mongoose = require('mongoose');
const { COURSE_CATEGORIES, SKILL_LEVELS } = require('./enums');
const { skillContentItemSchema } = require('./skillContentItem');
const { courseContentSchema } = require('./courseContent');

const skillSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    /** Card / list copy — same field name as Course.desc and FeatureCard `desc` in App.jsx */
    desc: {
      type: String,
      required: true,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    level: {
      type: String,
      enum: SKILL_LEVELS,
      default: 'beginner',
    },

    /** Same category set as courses / Explore cards (PROGRAMMING, DESIGN, …) */
    category: {
      type: String,
      required: true,
      enum: COURSE_CATEGORIES,
    },

    content: {
      type: courseContentSchema,
      required: false,
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    enrolledUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', skillSchema);
