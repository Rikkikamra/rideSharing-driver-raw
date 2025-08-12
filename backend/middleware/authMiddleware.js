// backend/middleware/authMiddleware.js

const jwt  = require('jsonwebtoken');
const User = require('../models/User');    // ensure path matches your project

/**
 * Protects HTTP routes by verifying JWT in Authorization header.
 * Attaches { id, role } to req.user.
 */
function authenticate(req, res, next) {
  // Header name is case-insensitive
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'Access Denied: No token provided.' });
  }
  const token = authHeader.split(' ')[1].trim();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Must include user ID
    if (!decoded.id) {
      return res
        .status(401)
        .json({ message: 'Invalid token: missing user ID.' });
    }

    // Attach only the fields we need
    req.user = { id: decoded.id, role: decoded.role };
    return next();

  } catch (err) {
    console.error('authMiddleware error:', err);
    return res
      .status(401)
      .json({ message: 'Invalid or expired token.' });
  }
}

/**
 * Verifies JWT from a Socket.io handshake.
 * @param {string} token
 * @returns {Promise<{ id: string, role: string }>}
 * @throws Error on missing, invalid, or expired token, or if user not found.
 */
async function verifySocketToken(token) {
  if (!token) {
    throw new Error('Access Denied: No token provided.');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error('Invalid or expired token.');
  }

  if (!decoded.id) {
    throw new Error('Invalid token: missing user ID.');
  }

  // Optionally ensure user still exists
  const user = await User.findById(decoded.id).select('_id role');
  if (!user) {
    throw new Error('User not found.');
  }

  return { id: user._id.toString(), role: user.role };
}

module.exports = authenticate;
module.exports.authenticate = authenticate;
module.exports.verifySocketToken = verifySocketToken;
