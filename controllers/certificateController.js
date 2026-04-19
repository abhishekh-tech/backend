const certificateService = require('../services/certificateService');

const createCertificate = async (req, res) => {
  try {
    const certificate = await certificateService.createCertificate(req.body);
    res.status(201).json(certificate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCertificates = async (req, res) => {
  try {
    // Students only see their own certificates; teachers/admins see all
    const learnerId = req.user.role === 'student' ? req.user._id : null;
    const certificates = await certificateService.getCertificates(learnerId);
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCertificateById = async (req, res) => {
  try {
    const certificate = await certificateService.getCertificateById(req.params.id);
    res.json(certificate);
  } catch (err) {
    if (err.message === 'Certificate not found') return res.status(404).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
};

const deleteCertificate = async (req, res) => {
  try {
    const result = await certificateService.deleteCertificate(req.params.id);
    res.json(result);
  } catch (err) {
    if (err.message === 'Certificate not found') return res.status(404).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createCertificate,
  getCertificates,
  getCertificateById,
  deleteCertificate,
};
