const express = require('express');
const router = express.Router();
const multer = require('multer');
const skillController = require('../controllers/skillController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB for skills usually enough
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf', 'text/plain', 'video/mp4', 'video/webm', 'video/quicktime'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, TXT, video files are allowed.'));
    }
  }
});

// Create - Teacher
router.post('/', authenticateToken, requireRole(['teacher']), upload.single('skillFile'), skillController.createSkill);

// Read - Teacher, Student, Admin
router.get('/', authenticateToken, requireRole(['teacher', 'student', 'admin']), skillController.getSkills);
router.get('/:id', authenticateToken, requireRole(['teacher', 'student', 'admin']), skillController.getSkillById);

// Update - Teacher
router.put('/:id', authenticateToken, requireRole(['teacher']), upload.single('skillFile'), skillController.updateSkill);

// Delete - Teacher
router.delete('/:id', authenticateToken, requireRole(['teacher']), skillController.deleteSkill);

// Download and Stream
router.get('/:id/download', authenticateToken, requireRole(['student', 'teacher', 'admin']), skillController.downloadSkillContent);
router.get('/:id/stream', authenticateToken, requireRole(['student', 'teacher', 'admin']), skillController.streamSkillContent);

module.exports = router;
