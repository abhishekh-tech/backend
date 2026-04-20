const connectToDatabase = require('../db');
const courseController = require('../controllers/courseController');
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

    // GET /api/courses - Get all courses
    if (url === '/api/courses' && method === 'GET') {
      await withAuth(req, res, (req, res) => courseController.getCourses(req, res), ['student', 'teacher', 'admin']);
      return;
    }

    // GET /api/courses/:id - Get course by ID
    if (url.match(/^\/api\/courses\/[^\/]+$/) && method === 'GET') {
      const id = url.split('/').pop();
      req.params = { id };
      await withAuth(req, res, (req, res) => courseController.getCourseById(req, res), ['student', 'teacher', 'admin']);
      return;
    }

    // POST /api/courses - Create course (teacher) - with file support
    if (url === '/api/courses' && method === 'POST') {
      req.body = JSON.parse(req.body);
      // Handle base64 file if present
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

    // PUT /api/courses/:id - Update course (teacher) - with file support
    if (url.match(/^\/api\/courses\/[^\/]+$/) && method === 'PUT') {
      const id = url.split('/').pop();
      req.params = { id };
      req.body = JSON.parse(req.body);
      // Handle base64 file if present
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

    // DELETE /api/courses/:id - Delete course (teacher)
    if (url.match(/^\/api\/courses\/[^\/]+$/) && method === 'DELETE') {
      const id = url.split('/').pop();
      req.params = { id };
      await withAuth(req, res, (req, res) => courseController.deleteCourse(req, res), ['teacher']);
      return;
    }

    // PUT /api/courses/:id/content - Update course content (teacher) - with file support
    if (url.match(/^\/api\/courses\/[^\/]+\/content$/) && method === 'PUT') {
      const id = url.split('/')[3];
      req.params = { id };
      req.body = JSON.parse(req.body);
      // Handle base64 file if present
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

    // GET /api/courses/:id/download - Download course content
    if (url.match(/^\/api\/courses\/[^\/]+\/download$/) && method === 'GET') {
      const id = url.split('/')[3];
      req.params = { id };
      await withAuth(req, res, (req, res) => courseController.downloadCourseContent(req, res), ['student', 'teacher', 'admin']);
      return;
    }

    // GET /api/courses/:id/stream - Stream course content
    if (url.match(/^\/api\/courses\/[^\/]+\/stream$/) && method === 'GET') {
      const id = url.split('/')[3];
      req.params = { id };
      await withAuth(req, res, (req, res) => courseController.streamCourseContent(req, res), ['student', 'teacher', 'admin']);
      return;
    }

    res.status(404).json({ message: 'Route not found' });
  } catch (error) {
    console.error('Error in courses function:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
