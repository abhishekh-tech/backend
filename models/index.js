const {
  COURSE_CATEGORIES,
  CONTENT_TYPES,
  USER_ROLES,
  SKILL_LEVELS,
  SKILL_CONTENT_TYPES,
  ENROLLMENT_STATUSES,
  CERTIFICATE_STATUSES,
} = require('./enums');
const { courseContentSchema } = require('./courseContent');
const { skillContentItemSchema } = require('./skillContentItem');

module.exports = {
  enums: {
    COURSE_CATEGORIES,
    CONTENT_TYPES,
    USER_ROLES,
    SKILL_LEVELS,
    SKILL_CONTENT_TYPES,
    ENROLLMENT_STATUSES,
    CERTIFICATE_STATUSES,
  },
  courseContentSchema,
  skillContentItemSchema,
};
