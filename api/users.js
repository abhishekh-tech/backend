const connectToDatabase = require('../db');
const userController = require('../controllers/userController');
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
    const { url, query } = req;
    const method = req.method;

    // POST /api/users - Create user (teacher, student)
    if (url === '/api/users' && method === 'POST') {
      req.body = JSON.parse(req.body);
      await withAuth(req, res, (req, res) => userController.createUser(req, res), ['teacher', 'student']);
      return;
    }

    // GET /api/users - Get all users (teacher, student)
    if (url === '/api/users' && method === 'GET') {
      await withAuth(req, res, (req, res) => userController.getUsers(req, res), ['teacher', 'student']);
      return;
    }

    // GET /api/users/:id - Get user by ID
    if (url.startsWith('/api/users/') && method === 'GET') {
      const id = url.split('/').pop();
      req.params = { id };
      await withAuth(req, res, (req, res) => userController.getUserById(req, res), ['teacher', 'student']);
      return;
    }

    // PUT /api/users/:id - Update user (admin or self)
    if (url.startsWith('/api/users/') && method === 'PUT') {
      const id = url.split('/').pop();
      req.params = { id };
      req.body = JSON.parse(req.body);
      await withAuth(req, res, (req, res) => userController.updateUser(req, res), []);
      return;
    }

    // DELETE /api/users/:id - Delete user (admin)
    if (url.startsWith('/api/users/') && method === 'DELETE') {
      const id = url.split('/').pop();
      req.params = { id };
      await withAuth(req, res, (req, res) => userController.deleteUser(req, res), ['admin']);
      return;
    }

    res.status(404).json({ message: 'Route not found' });
  } catch (error) {
    console.error('Error in users function:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
