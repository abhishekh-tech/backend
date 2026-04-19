const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

// Create - Teacher, Student
router.post('/', authenticateToken, requireRole(['teacher', 'student']), userController.createUser);

// Read - Teacher, Student
router.get('/', authenticateToken, requireRole(['teacher', 'student']), userController.getUsers);
router.get('/:id', authenticateToken, requireRole(['teacher', 'student']), userController.getUserById);

// Update - Admin or Self
router.put('/:id', authenticateToken, userController.updateUser);

// Delete - Admin
router.delete('/:id', authenticateToken, requireRole(['admin']), userController.deleteUser);

module.exports = router;
