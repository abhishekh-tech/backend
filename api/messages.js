const connectToDatabase = require('../db');
const messageController = require('../controllers/messageController');
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

    // POST /api/messages - Create message (teacher, student)
    if (url === '/api/messages' && method === 'POST') {
      req.body = JSON.parse(req.body);
      await withAuth(req, res, (req, res) => messageController.createMessage(req, res), ['teacher', 'student']);
      return;
    }

    // GET /api/messages - Get all messages (teacher, student, admin)
    if (url === '/api/messages' && method === 'GET') {
      await withAuth(req, res, (req, res) => messageController.getMessages(req, res), ['teacher', 'student', 'admin']);
      return;
    }

    // GET /api/messages/conversation/:userId - Get conversation
    if (url.includes('/api/messages/conversation/') && method === 'GET') {
      const userId = url.split('/').pop();
      req.params = { userId };
      await withAuth(req, res, (req, res) => messageController.getConversation(req, res), ['teacher', 'student', 'admin']);
      return;
    }

    // GET /api/messages/:id - Get message by ID
    if (url.startsWith('/api/messages/') && !url.includes('/conversation/') && method === 'GET') {
      const id = url.split('/').pop();
      req.params = { id };
      await withAuth(req, res, (req, res) => messageController.getMessageById(req, res), ['teacher', 'student', 'admin']);
      return;
    }

    // DELETE /api/messages/:id - Delete message (teacher, student, admin)
    if (url.startsWith('/api/messages/') && !url.includes('/conversation/') && method === 'DELETE') {
      const id = url.split('/').pop();
      req.params = { id };
      await withAuth(req, res, (req, res) => messageController.deleteMessage(req, res), ['teacher', 'student', 'admin']);
      return;
    }

    res.status(404).json({ message: 'Route not found' });
  } catch (error) {
    console.error('Error in messages function:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
