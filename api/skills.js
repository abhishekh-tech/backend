const connectToDatabase = require('../db');
const skillController = require('../controllers/skillController');
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

    // GET /api/skills - Get all skills
    if (url === '/api/skills' && method === 'GET') {
      req.query = query;
      await withAuth(req, res, (req, res) => skillController.getSkills(req, res), ['teacher', 'student', 'admin']);
      return;
    }

    // GET /api/skills/:id - Get skill by ID
    if (url.match(/^\/api\/skills\/[^\/]+$/) && method === 'GET') {
      const id = url.split('/').pop();
      req.params = { id };
      await withAuth(req, res, (req, res) => skillController.getSkillById(req, res), ['teacher', 'student', 'admin']);
      return;
    }

    // POST /api/skills - Create skill (teacher) - with file support
    if (url === '/api/skills' && method === 'POST') {
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
      await withAuth(req, res, (req, res) => skillController.createSkill(req, res), ['teacher']);
      return;
    }

    // PUT /api/skills/:id - Update skill (teacher) - with file support
    if (url.match(/^\/api\/skills\/[^\/]+$/) && method === 'PUT') {
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
      await withAuth(req, res, (req, res) => skillController.updateSkill(req, res), ['teacher']);
      return;
    }

    // DELETE /api/skills/:id - Delete skill (teacher)
    if (url.match(/^\/api\/skills\/[^\/]+$/) && method === 'DELETE') {
      const id = url.split('/').pop();
      req.params = { id };
      await withAuth(req, res, (req, res) => skillController.deleteSkill(req, res), ['teacher']);
      return;
    }

    // GET /api/skills/:id/download - Download skill content
    if (url.match(/^\/api\/skills\/[^\/]+\/download$/) && method === 'GET') {
      const id = url.split('/')[3];
      req.params = { id };
      await withAuth(req, res, (req, res) => skillController.downloadSkillContent(req, res), ['student', 'teacher', 'admin']);
      return;
    }

    // GET /api/skills/:id/stream - Stream skill content
    if (url.match(/^\/api\/skills\/[^\/]+\/stream$/) && method === 'GET') {
      const id = url.split('/')[3];
      req.params = { id };
      await withAuth(req, res, (req, res) => skillController.streamSkillContent(req, res), ['student', 'teacher', 'admin']);
      return;
    }

    res.status(404).json({ message: 'Route not found' });
  } catch (error) {
    console.error('Error in skills function:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
