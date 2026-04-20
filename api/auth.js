const connectToDatabase = require('../db');
const authController = require('../controllers/authController');

module.exports = async (req, res) => {
  await connectToDatabase();

  // Set CORS headers
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

    // Route: POST /api/auth/signup
    if (url === '/api/auth/signup' && method === 'POST') {
      req.body = JSON.parse(req.body);
      await authController.signup(req, res);
      return;
    }

    // Route: POST /api/auth/login
    if (url === '/api/auth/login' && method === 'POST') {
      req.body = JSON.parse(req.body);
      await authController.login(req, res);
      return;
    }

    res.status(404).json({ message: 'Route not found' });
  } catch (error) {
    console.error('Error in auth function:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
