// backend/controllers/tokenController.js

/**
 * Token controller
 *
 * Provides an endpoint to exchange a refresh token for a new access
 * token and refresh token pair.  This controller expects the
 * `refreshToken` property to be supplied in the request body.  It
 * verifies the refresh token using the same JWT secret used for
 * access tokens.  In a production system you would store
 * refresh tokens in a database and revoke them upon logout or
 * expiration.  For demonstration purposes this implementation
 * simply re‑issues new tokens if the provided refresh token is
 * valid.
 */

const jwt = require('jsonwebtoken');

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required.' });
    }
    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid refresh token.' });
    }
    const { id, role } = payload;
    // Issue a new access token (short lived, e.g. 15 minutes)
    const accessToken = jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    // Issue a new refresh token (long lived, e.g. 7 days)
    const newRefreshToken = jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    console.error('refreshToken error:', err);
    return res.status(500).json({ message: 'Token refresh failed.' });
  }
};