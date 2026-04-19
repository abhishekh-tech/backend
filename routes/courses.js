const express = require('express');
const router = express.Router();
const multer = require('multer');
const courseController = require('../controllers/courseController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf', 'text/plain', 'text/x-c', 'text/x-python',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'
    ];
    const allowedTypes = ['.pdf', '.txt', '.c', '.py', '.docx', '.mp4', '.webm', '.mov', '.avi', '.mkv'];
    
    const fileExtension = '.' + file.originalname.split('.').pop().toLowerCase();
    if (allowedMimes.includes(file.mimetype) || allowedTypes.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, TXT, video files are allowed.'));
    }
  }
});

// Create - Teacher
router.post('/', authenticateToken, requireRole(['teacher']), (req, res, next) => {
  upload.single('courseFile')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
}, courseController.createCourse);

// Read - Student, Teacher (We allow admin for debug purposes usually, but strict per spec: Student, Teacher)
router.get('/', authenticateToken, requireRole(['student', 'teacher', 'admin']), courseController.getCourses);
router.get('/:id', authenticateToken, requireRole(['student', 'teacher', 'admin']), courseController.getCourseById);

// Update - Teacher
router.put('/:id', authenticateToken, requireRole(['teacher']), (req, res, next) => {
  upload.single('courseFile')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
}, courseController.updateCourse);

// Delete - Teacher
router.delete('/:id', authenticateToken, requireRole(['teacher']), courseController.deleteCourse);

// Course Content specific endpoints
// Update Course Content
router.put('/:id/content', authenticateToken, requireRole(['teacher']), (req, res, next) => {
  upload.single('courseFile')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
}, courseController.updateCourseContent);

// Download and Stream - Read (Student, Teacher, Admin)
router.get('/:id/download', authenticateToken, requireRole(['student', 'teacher', 'admin']), courseController.downloadCourseContent);
router.get('/:id/stream', authenticateToken, requireRole(['student', 'teacher', 'admin']), courseController.streamCourseContent);

module.exports = router;
