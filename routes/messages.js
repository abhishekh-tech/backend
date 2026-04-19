const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

// Create - Teacher, Student (sender auto-set from JWT in controller)
router.post('/', authenticateToken, requireRole(['teacher', 'student']), messageController.createMessage);

// Read - all messages involving the current user
router.get('/', authenticateToken, requireRole(['teacher', 'student', 'admin']), messageController.getMessages);
router.get('/conversation/:userId', authenticateToken, requireRole(['teacher', 'student', 'admin']), messageController.getConversation);
router.get('/:id', authenticateToken, requireRole(['teacher', 'student', 'admin']), messageController.getMessageById);

// Delete - sender or admin
router.delete('/:id', authenticateToken, requireRole(['teacher', 'student', 'admin']), messageController.deleteMessage);

module.exports = router;
