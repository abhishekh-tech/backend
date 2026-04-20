const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

async function withAuth(req, res, handler, roles = []) {
  try {
    // Run authentication middleware
    await new Promise((resolve, reject) => {
      authenticateToken(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // If roles specified, check role
    if (roles.length > 0) {
      await new Promise((resolve, reject) => {
        requireRole(roles)(req, res, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    // Execute the handler
    await handler(req, res);
  } catch (error) {
    if (error.message && error.message.includes('Access Denied') || error.message.includes('Role not authorized')) {
      res.status(401).json({ message: error.message });
    } else {
      throw error;
    }
  }
}

module.exports = { withAuth };
