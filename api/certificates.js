const connectToDatabase = require('../db');
const certificateController = require('../controllers/certificateController');
const { withAuth } = require('./helpers');

module.exports = async (req, res) => {
  await connectToDatabase();

  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { url } = req;
    const method = req.method;

    // POST /api/certificates - Create certificate (teacher)
    if (url === '/api/certificates' && method === 'POST') {
      req.body = JSON.parse(req.body);
      await withAuth(req, res, (req, res) => certificateController.createCertificate(req, res), ['teacher']);
      return;
    }

    // GET /api/certificates - Get all certificates (teacher, student, admin)
    if (url === '/api/certificates' && method === 'GET') {
      await withAuth(req, res, (req, res) => certificateController.getCertificates(req, res), ['teacher', 'student', 'admin']);
      return;
    }

    // GET /api/certificates/:id - Get certificate by ID
    if (url.startsWith('/api/certificates/') && method === 'GET') {
      const id = url.split('/').pop();
      req.params = { id };
      await withAuth(req, res, (req, res) => certificateController.getCertificateById(req, res), ['teacher', 'student', 'admin']);
      return;
    }

    // DELETE /api/certificates/:id - Delete certificate (teacher)
    if (url.startsWith('/api/certificates/') && method === 'DELETE') {
      const id = url.split('/').pop();
      req.params = { id };
      await withAuth(req, res, (req, res) => certificateController.deleteCertificate(req, res), ['teacher']);
      return;
    }

    res.status(404).json({ message: 'Route not found' });
  } catch (error) {
    console.error('Error in certificates function:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
