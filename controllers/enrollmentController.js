const enrollmentService = require('../services/enrollmentService');

const createEnrollment = async (req, res) => {
  try {
    const enrollmentData = { ...req.body };
    // Students can only enroll themselves — ignore any user field they pass
    if (req.user.role === 'student') {
      enrollmentData.user = req.user._id;
    }
    const enrollment = await enrollmentService.createEnrollment(enrollmentData);
    res.status(201).json(enrollment);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'User is already enrolled in this course.' });
    }
    res.status(500).json({ message: err.message });
  }
};

const getEnrollments = async (req, res) => {
  try {
    // Students only see their own enrollments; teachers/admins see all
    const userId = req.user.role === 'student' ? req.user._id : null;
    const enrollments = await enrollmentService.getEnrollments(userId);
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await enrollmentService.getEnrollmentById(req.params.id);
    res.json(enrollment);
  } catch (err) {
    if (err.message === 'Enrollment not found') return res.status(404).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
};

const updateEnrollment = async (req, res) => {
  try {
    const enrollment = await enrollmentService.updateEnrollment(req.params.id, req.body);
    res.json(enrollment);
  } catch (err) {
    if (err.message === 'Enrollment not found') return res.status(404).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
};

const deleteEnrollment = async (req, res) => {
  try {
    const result = await enrollmentService.deleteEnrollment(req.params.id);
    res.json(result);
  } catch (err) {
    if (err.message === 'Enrollment not found') return res.status(404).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createEnrollment,
  getEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
};
