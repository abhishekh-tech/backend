const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

// Create - Student (self-enroll) or Admin
router.post('/', authenticateToken, requireRole(['student', 'admin']), enrollmentController.createEnrollment);

// Read - Teacher, Student (students see only their own)
router.get('/', authenticateToken, requireRole(['teacher', 'student', 'admin']), enrollmentController.getEnrollments);
router.get('/:id', authenticateToken, requireRole(['teacher', 'student', 'admin']), enrollmentController.getEnrollmentById);

// Update - Admin
router.put('/:id', authenticateToken, requireRole(['admin']), enrollmentController.updateEnrollment);

// Delete - Admin
router.delete('/:id', authenticateToken, requireRole(['admin']), enrollmentController.deleteEnrollment);

module.exports = router;
