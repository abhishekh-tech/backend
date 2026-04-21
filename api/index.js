const connectToDatabase = require('../db');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const enrollmentController = require('../controllers/enrollmentController');
const messageController = require('../controllers/messageController');
const certificateController = require('../controllers/certificateController');
const courseController = require('../controllers/courseController');
const skillController = require('../controllers/skillController');
const { withAuth } = require('./helpers');

module.exports = async (req, res) => {

  // ✅ FINAL CORS FIX (supports production + preview)
  const allowedOrigins = [
    'https://frontend-f63r.vercel.app',
    'https://frontend-f63r-jrs5mox87-abhishekh-redmen-team.vercel.app'
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // ✅ Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await connectToDatabase();

  try {
    const { url, query } = req;
    const method = req.method;

    // Parse body if needed
    if (req.body && typeof req.body === 'string') {
      try {
        req.body = JSON.parse(req.body);
      } catch (e) {}
    }

    // ================= AUTH =================
    if (url === '/api/auth/signup' && method === 'POST') {
      return await authController.signup(req, res);
    }

    if (url === '/api/auth/login' && method === 'POST') {
      return await authController.login(req, res);
    }

    // ================= USERS =================
    if (url === '/api/users' && method === 'POST') {
      return await withAuth(req, res, (req, res) => userController.createUser(req, res), ['teacher', 'student']);
    }

    if (url === '/api/users' && method === 'GET') {
      return await withAuth(req, res, (req, res) => userController.getUsers(req, res), ['teacher', 'student']);
    }

    if (url.startsWith('/api/users/') && method === 'GET') {
      const id = url.split('/').pop();
      req.params = { id };
      return await withAuth(req, res, (req, res) => userController.getUserById(req, res), ['teacher', 'student']);
    }

    if (url.startsWith('/api/users/') && method === 'PUT') {
      const id = url.split('/').pop();
      req.params = { id };
      return await withAuth(req, res, (req, res) => userController.updateUser(req, res), []);
    }

    if (url.startsWith('/api/users/') && method === 'DELETE') {
      const id = url.split('/').pop();
      req.params = { id };
      return await withAuth(req, res, (req, res) => userController.deleteUser(req, res), ['admin']);
    }

    // ================= ENROLLMENTS =================
    if (url === '/api/enrollments' && method === 'POST') {
      return await withAuth(req, res, (req, res) => enrollmentController.createEnrollment(req, res), ['student', 'admin']);
    }

    if (url === '/api/enrollments' && method === 'GET') {
      return await withAuth(req, res, (req, res) => enrollmentController.getEnrollments(req, res), ['teacher', 'student', 'admin']);
    }

    if (url.startsWith('/api/enrollments/') && method === 'GET') {
      const id = url.split('/').pop();
      req.params = { id };
      return await withAuth(req, res, (req, res) => enrollmentController.getEnrollmentById(req, res), ['teacher', 'student', 'admin']);
    }

    if (url.startsWith('/api/enrollments/') && method === 'PUT') {
      const id = url.split('/').pop();
      req.params = { id };
      return await withAuth(req, res, (req, res) => enrollmentController.updateEnrollment(req, res), ['admin']);
    }

    if (url.startsWith('/api/enrollments/') && method === 'DELETE') {
      const id = url.split('/').pop();
      req.params = { id };
      return await withAuth(req, res, (req, res) => enrollmentController.deleteEnrollment(req, res), ['admin']);
    }

    // ================= MESSAGES =================
    if (url === '/api/messages' && method === 'POST') {
      return await withAuth(req, res, (req, res) => messageController.createMessage(req, res), ['teacher', 'student']);
    }

    if (url === '/api/messages' && method === 'GET') {
      return await withAuth(req, res, (req, res) => messageController.getMessages(req, res), ['teacher', 'student', 'admin']);
    }

    if (url.includes('/api/messages/conversation/') && method === 'GET') {
      const userId = url.split('/').pop();
      req.params = { userId };
      return await withAuth(req, res, (req, res) => messageController.getConversation(req, res), ['teacher', 'student', 'admin']);
    }

    if (url.startsWith('/api/messages/') && !url.includes('/conversation/') && method === 'GET') {
      const id = url.split('/').pop();
      req.params = { id };
      return await withAuth(req, res, (req, res) => messageController.getMessageById(req, res), ['teacher', 'student', 'admin']);
    }

    if (url.startsWith('/api/messages/') && !url.includes('/conversation/') && method === 'DELETE') {
      const id = url.split('/').pop();
      req.params = { id };
      return await withAuth(req, res, (req, res) => messageController.deleteMessage(req, res), ['teacher', 'student', 'admin']);
    }

    // ================= CERTIFICATES =================
    if (url === '/api/certificates' && method === 'POST') {
      return await withAuth(req, res, (req, res) => certificateController.createCertificate(req, res), ['teacher']);
    }

    if (url === '/api/certificates' && method === 'GET') {
      return await withAuth(req, res, (req, res) => certificateController.getCertificates(req, res), ['teacher', 'student', 'admin']);
    }

    // ================= COURSES =================
    if (url === '/api/courses' && method === 'GET') {
      return await withAuth(req, res, (req, res) => courseController.getCourses(req, res), ['student', 'teacher', 'admin']);
    }

    if (url === '/api/courses' && method === 'POST') {
      return await withAuth(req, res, (req, res) => courseController.createCourse(req, res), ['teacher']);
    }

    // ================= SKILLS =================
    if (url === '/api/skills' && method === 'GET') {
      req.query = query;
      return await withAuth(req, res, (req, res) => skillController.getSkills(req, res), ['teacher', 'student', 'admin']);
    }

    if (url === '/api/skills' && method === 'POST') {
      return await withAuth(req, res, (req, res) => skillController.createSkill(req, res), ['teacher']);
    }

    // ================= DEFAULT =================
    return res.status(404).json({ message: 'Route not found' });

  } catch (error) {
    console.error('Error in API function:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};