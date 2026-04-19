const Enrollment = require('../models/Enrollment');

const createEnrollment = async (enrollmentData) => {
  const enrollment = new Enrollment(enrollmentData);
  return await enrollment.save();
};

const getEnrollments = async (userId = null) => {
  const filter = userId ? { user: userId } : {};
  return await Enrollment.find(filter).populate('user').populate('course');
};

const getEnrollmentById = async (id) => {
  const enrollment = await Enrollment.findById(id).populate('user').populate('course');
  if (!enrollment) throw new Error('Enrollment not found');
  return enrollment;
};

const updateEnrollment = async (id, updateData) => {
  const enrollment = await Enrollment.findByIdAndUpdate(id, updateData, { new: true });
  if (!enrollment) throw new Error('Enrollment not found');
  return enrollment;
};

const deleteEnrollment = async (id) => {
  const enrollment = await Enrollment.findByIdAndDelete(id);
  if (!enrollment) throw new Error('Enrollment not found');
  return { message: 'Enrollment deleted successfully' };
};

module.exports = {
  createEnrollment,
  getEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
};
