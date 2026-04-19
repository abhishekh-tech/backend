/**
 * Shared enums aligned with `frontend/frontend/src/App.jsx`.
 *
 * Used in UI today:
 * - Auth: name, email, password → User
 * - Teacher course form: category, contentType → Course + courseContent
 * - Learner course viewer: content.type, mimeType, fileName, fileSize
 *
 * Not wired to API yet (placeholders in sidebar only): Messages → Message; Enroll flow → Enrollment.
 * No model yet for Wishlist. Certificates → Certificate model.
 */

/** Course & explore category values — TeacherDashboard category <select> */
const COURSE_CATEGORIES = [
  'PROGRAMMING',
  'DESIGN',
  'LANGUAGES',
  'BUSINESS',
  'MUSIC',
  'FITNESS',
  'OTHER',
];

/** Stored on Course.content.type — TeacherDashboard contentType <select> */
const CONTENT_TYPES = ['pdf', 'text-file', 'video'];

/** User.role — Navbar / role-based access (User model) */
const USER_ROLES = ['student', 'teacher', 'admin'];

/** Skill.level — skill listings (Skills model; learner/teacher flows) */
const SKILL_LEVELS = ['beginner', 'intermediate', 'advanced'];

/** Skill content entries (Skills model) */
const SKILL_CONTENT_TYPES = ['video', 'article', 'link'];

/** Enrollment.status — learner ↔ course */
const ENROLLMENT_STATUSES = ['active', 'completed', 'dropped'];

/** Certificate.status — issued credential lifecycle */
const CERTIFICATE_STATUSES = ['active', 'revoked'];

module.exports = {
  COURSE_CATEGORIES,
  CONTENT_TYPES,
  USER_ROLES,
  SKILL_LEVELS,
  SKILL_CONTENT_TYPES,
  ENROLLMENT_STATUSES,
  CERTIFICATE_STATUSES,
};
