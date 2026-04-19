const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

// Create - Teacher
router.post('/', authenticateToken, requireRole(['teacher']), certificateController.createCertificate);

// Read - Student, Teacher
router.get('/', authenticateToken, requireRole(['teacher', 'student', 'admin']), certificateController.getCertificates);
router.get('/:id', authenticateToken, requireRole(['teacher', 'student', 'admin']), certificateController.getCertificateById);

// Delete - Teacher
router.delete('/:id', authenticateToken, requireRole(['teacher']), certificateController.deleteCertificate);

module.exports = router;
