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
  await connectToDatabase();

  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
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

    // Parse body if present
    if (req.body && typeof req.body === 'string') {
      try {
        req.body = JSON.parse(req.body);
      } catch (e) {
        // Body is not JSON, keep as-is
      }
    }

    // AUTH ROUTES
    if (url === '/api/auth/signup' && method === 'POST') {
      await authController.signup(req, res);
      return;
    }
    if (url === '/api/auth/login' && method === 'POST') {
      await authController.login(req, res);
      return;
    }

    // USER ROUTES
    if (url === '/api/users' && method === 'POST') {
      await withAuth(req, res, (req, res) => userController.createUser(req, res), ['teacher', 'student']);
      return;
    }
    if (url === '/api/users' && method === 'GET') {
      await withAuth(req, res, (req, res) => userController.getUsers(req, res), ['teacher', 'student']);
      return;
    }
    if (url.startsWith('/api/users/') && method === 'GET') {
      const id = url.split('/').pop();
      req.params = { id };
      await withAuth(req, res, (req, res) => userController.getUserById(req, res), ['teacher', 'student']);
      return;
    }
    if (url.startsWith('/api/users/') && method === 'PUT') {
      const id = url.split('/').pop();
      req.params = { id };
      await withAuth(req, res, (req, res) => userController.updateUser(req, res), []);
      return;
    }
    if (url.startsWith('/api/users/') && method === 'DELETE') {
      const id = url.split('/').pop();
      req.params = { id };
      await withAuth(req, res, (req, res) => userController.deleteUser(req, res), ['admin']);
      return;
    }

    // ENROLLMENT ROUTES
    if (url === '/api/enrollments' && method === 'POST') {
      await withAuth(req, res, (req, res) => enrollmentController.createEnrollment(req, res), ['student', 'admin']);
      return;
    }
    if (url === '/api/enrollments' && method === 'GET') {
      await withAuth(req, res, (req, res) => enrollmentController.getEnrollments(req, res), ['teacher', 'student', 'admin']);
      return;
    }
    if (url.startsWith('/api/enrollments/') && method === 'GET') {
      const id = url.split('/').pop();
      req.params = { id };
      await withAuth(req, res, (req, res) => enrollmentController.getEnrollmentById(req, res), ['teacher', 'student', 'admin']);
      return;
    }
    if (url.startsWith('/api/enrollments/') && method === 'PUT') {
      const id = url.split('/').pop();
      req.params = { id };
      await withAuth(req, res, (req, res) => enrollmentController.updateEnrollment(req, res), ['admin']);
      return;
    }
    if (url.startsWith('/api/enrollments/') && method === 'DELETE') {
      const id = url.split('/').pop();
      req.params = { id };
      await withAuth(req, res, (req, res) => enrollmentController.deleteEnrollment(req, res), ['admin']);
      return;
    }

    // MESSAGE ROUTES
    if (url === '/api/messages' && method === 'POST') {
      await withAuth(req, res, (req, res) => messageController.createMessage(req, res), ['teacher', 'student']);
      return;
    }
    if (url === '/api/messages' && method === 'GET') {
      await withAuth(req, res, (req, res) => messageController.getMessages(req, res), ['teacher', 'student', 'admin']);
      return;
    }
    if (url.includes('/api/messages/conversation/') && method === 'GET') {
      const userId = url.split('/').pop();
      req.params = { userId };
      await withAuth(req, res, (req, res) => messageController.getConversation(req, res), ['teacher', 'student', 'admin']);
      return;
    }
    if (url.startsWith('/api/messages/') && !url.includes('/conversation/') && method === 'GET') {
      const id = url.split('/').pop();
      req.params = { id };
      await withAuth(req, res, (req, res) => messageController.getMessageById(req, res), ['teacher', 'student', 'admin']);
      return;
    }
    if (url.startsWith('/api/messages/') && !url.includes('/conversation/') && method === 'DELETE') {
      const id = url.split('/').pop();
      req.params = { id };
      await withAuth(req, res, (req, res) => messageController.deleteMessage(req, res), ['teacher', 'student', 'admin']);
      return;
    }

    // CERTIFICATE ROUTES
    if (url === '/api/certificates' && method === 'POST') {
      await withAuth(req, res, (req, res) => certificateController.createCertificate(req, res), ['teacher']);
      return;
    }
    if (url === '/api/certificates' && method === 'GET') {
      await withAuth(req, res, (req, res) => certificateController.getCertificates(req, res), ['teacher', 'student', 'admin']);
      return;
    }
    if (url.startsWith('/api/certificates/') && method === 'GET') {
      const id = url.split('/').pop();
      req.params = { id };
      await withAuth(req, res, (req, res) => certificateController.getCertificateById(req, res), ['teacher', 'student', 'admin']);
      return;
    }
    if (url.startsWith('/api/certificates/') && method === 'DELETE') {
      const id = url.split('/').pop();
      req.params = { id };
      await withAuth(req, res, (req, res) => certificateController.deleteCertificate(req, res), ['teacher']);
      return;
    }

    // COURSE ROUTES
    if (url === '/api/courses' && method === 'GET') {
      await withAuth(req, res, (req, res) => courseController.getCourses(req, res), ['student', 'teacher', 'admin']);
      return;
    }
    if (url.match(/^\/api\/courses\/[^\/]+$/) && method === 'GET') {
      const id = url.split('/').pop();
      req.params = { id };
      await withAuth(req, res, (req, res) => courseController.getCourseById(req, res), ['student', 'teacher', 'admin']);
      return;
    }
    if (url === '/api/courses' && method === 'POST') {
      if (req.body.fileData) {
        req.file = {
          buffer: Buffer.from(req.body.fileData, 'base64'),
          originalname: req.body.fileName || 'file',
          mimetype: req.body.mimeType || 'application/octet-stream'
        };
        delete req.body.fileData;
        delete req.body.fileName;
        delete req.body.mimeType;
      }
      await withAuth(req, res, (req, res) => courseController.createCourse(req, res), ['teacher']);
      return;
    }
    if (url.match(/^\/api\/courses\/[^\/]+$/) && method === 'PUT') {
      const id = url.split('/').pop();
      req.params = { id };
      if (req.body.fileData) {
        req.file = {
          buffer: Buffer.from(req.body.fileData, 'base64'),
          originalname: req.body.fileName || 'file',
          mimetype: req.body.mimeType || 'application/octet-stream'
        };
        delete req.body.fileData;
        delete req.body.fileName;
        delete req.body.mimeType;
      }
      await withAuth(req, res, (req, res) => courseController.updateCourse(req, res), ['teacher']);
      return;
    }
    if (url.match(/^\/api\/courses\/[^\/]+$/) && method === 'DELETE') {
      const id = url.split('/').pop();
      req.params = { id };
      await withAuth(req, res, (req, res) => courseController.deleteCourse(req, res), ['teacher']);
      return;
    }
    if (url.match(/^\/api\/courses\/[^\/]+\/content$/) && method === 'PUT') {
      const id = url.split('/')[3];
      req.params = { id };
      if (req.body.fileData) {
        req.file = {
          buffer: Buffer.from(req.body.fileData, 'base64'),
          originalname: req.body.fileName || 'file',
          mimetype: req.body.mimeType || 'application/octet-stream'
        };
        delete req.body.fileData;
        delete req.body.fileName;
        delete req.body.mimeType;
      }
      await withAuth(req, res, (req, res) => courseController.updateCourseContent(req, res), ['teacher']);
      return;
    }
    if (url.match(/^\/api\/courses\/[^\/]+\/download$/) && method === 'GET') {
      const id = url.split('/')[3];
      req.params = { id };
      await withAuth(req, res, (req, res) => courseController.downloadCourseContent(req, res), ['student', 'teacher', 'admin']);
      return;
    }
    if (url.match(/^\/api\/courses\/[^\/]+\/stream$/) && method === 'GET') {
      const id = url.split('/')[3];
      req.params = { id };
      await withAuth(req, res, (req, res) => courseController.streamCourseContent(req, res), ['student', 'teacher', 'admin']);
      return;
    }

    // SKILL ROUTES
    if (url === '/api/skills' && method === 'GET') {
      req.query = query;
      await withAuth(req, res, (req, res) => skillController.getSkills(req, res), ['teacher', 'student', 'admin']);
      return;
    }
    if (url.match(/^\/api\/skills\/[^\/]+$/) && method === 'GET') {
      const id = url.split('/').pop();
      req.params = { id };
      await withAuth(req, res, (req, res) => skillController.getSkillById(req, res), ['teacher', 'student', 'admin']);
      return;
    }
    if (url === '/api/skills' && method === 'POST') {
      if (req.body.fileData) {
        req.file = {
          buffer: Buffer.from(req.body.fileData, 'base64'),
          originalname: req.body.fileName || 'file',
          mimetype: req.body.mimeType || 'application/octet-stream'
        };
        delete req.body.fileData;
        delete req.body.fileName;
        delete req.body.mimeType;
      }
      await withAuth(req, res, (req, res) => skillController.createSkill(req, res), ['teacher']);
      return;
    }
    if (url.match(/^\/api\/skills\/[^\/]+$/) && method === 'PUT') {
      const id = url.split('/').pop();
      req.params = { id };
      if (req.body.fileData) {
        req.file = {
          buffer: Buffer.from(req.body.fileData, 'base64'),
          originalname: req.body.fileName || 'file',
          mimetype: req.body.mimeType || 'application/octet-stream'
        };
        delete req.body.fileData;
        delete req.body.fileName;
        delete req.body.mimeType;
      }
      await withAuth(req, res, (req, res) => skillController.updateSkill(req, res), ['teacher']);
      return;
    }
    if (url.match(/^\/api\/skills\/[^\/]+$/) && method === 'DELETE') {
      const id = url.split('/').pop();
      req.params = { id };
      await withAuth(req, res, (req, res) => skillController.deleteSkill(req, res), ['teacher']);
      return;
    }
    if (url.match(/^\/api\/skills\/[^\/]+\/download$/) && method === 'GET') {
      const id = url.split('/')[3];
      req.params = { id };
      await withAuth(req, res, (req, res) => skillController.downloadSkillContent(req, res), ['student', 'teacher', 'admin']);
      return;
    }
    if (url.match(/^\/api\/skills\/[^\/]+\/stream$/) && method === 'GET') {
      const id = url.split('/')[3];
      req.params = { id };
      await withAuth(req, res, (req, res) => skillController.streamSkillContent(req, res), ['student', 'teacher', 'admin']);
      return;
    }

    res.status(404).json({ message: 'Route not found' });
  } catch (error) {
    console.error('Error in API function:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
