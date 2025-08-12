// backend/middleware/adminMiddleware.js

module.exports = (req, res, next) => {
    // Assumes req.user is set by a previous auth middleware (JWT-based)
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required.' });
    }
    next();
  };
  