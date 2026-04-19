const mongoose = require('mongoose');
const { SKILL_CONTENT_TYPES } = require('./enums');

/** One item in Skill.content[] */
const skillContentItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: SKILL_CONTENT_TYPES,
      required: true,
    },
    value: { type: String },
  },
  { _id: false }
);

module.exports = { skillContentItemSchema };
