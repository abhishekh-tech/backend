const Certificate = require('../models/Certificate');

const createCertificate = async (certData) => {
  const certificate = new Certificate(certData);
  return await certificate.save();
};

const getCertificates = async (learnerId = null) => {
  const filter = learnerId ? { learner: learnerId } : {};
  return await Certificate.find(filter).populate('learner').populate('course');
};

const getCertificateById = async (id) => {
  const certificate = await Certificate.findById(id).populate('learner').populate('course');
  if (!certificate) throw new Error('Certificate not found');
  return certificate;
};

const deleteCertificate = async (id) => {
  const certificate = await Certificate.findByIdAndDelete(id);
  if (!certificate) throw new Error('Certificate not found');
  return { message: 'Certificate deleted successfully' };
};

module.exports = {
  createCertificate,
  getCertificates,
  getCertificateById,
  deleteCertificate,
};
