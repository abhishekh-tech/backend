const connectToDatabase = require('../db');
const enrollmentController = require('../controllers/enrollmentController');
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

    // POST /api/enrollments - Create enrollment (student, admin)
    if (url === '/api/enrollments' && method === 'POST') {
      req.body = JSON.parse(req.body);
      await withAuth(req, res, (req, res) => enrollmentController.createEnrollment(req, res), ['student', 'admin']);
      return;
    }

    // GET /api/enrollments - Get all enrollments (teacher, student, admin)
    if (url === '/api/enrollments' && method === 'GET') {
      await withAuth(req, res, (req, res) => enrollmentController.getEnrollments(req, res), ['teacher', 'student', 'admin']);
      return;
    }

    // GET /api/enrollments/:id - Get enrollment by ID
    if (url.startsWith('/api/enrollments/') && method === 'GET') {
      const id = url.split('/').pop();
      req.params = { id };
      await withAuth(req, res, (req, res) => enrollmentController.getEnrollmentById(req, res), ['teacher', 'student', 'admin']);
      return;
    }

    // PUT /api/enrollments/:id - Update enrollment (admin)
    if (url.startsWith('/api/enrollments/') && method === 'PUT') {
      const id = url.split('/').pop();
      req.params = { id };
      req.body = JSON.parse(req.body);
      await withAuth(req, res, (req, res) => enrollmentController.updateEnrollment(req, res), ['admin']);
      return;
    }

    // DELETE /api/enrollments/:id - Delete enrollment (admin)
    if (url.startsWith('/api/enrollments/') && method === 'DELETE') {
      const id = url.split('/').pop();
      req.params = { id };
      await withAuth(req, res, (req, res) => enrollmentController.deleteEnrollment(req, res), ['admin']);
      return;
    }

    res.status(404).json({ message: 'Route not found' });
  } catch (error) {
    console.error('Error in enrollments function:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
