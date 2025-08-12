/*
 * Authentication routes
 *
 * Exposes driver signup, Google & Apple social sign-in, and logout.
 */
const express = require('express');
// Authentication router.  This module defines endpoints for user
// registration, login, social sign‑in, logout and token refresh.  It
// intentionally delegates all persistent logic to the appropriate
// controllers (userController, authController, tokenController) and
// applies simple rate limiting on the login route to mitigate brute
// force attacks.

const { appleSignup, googleSignup } = require('../controllers/authController');
const userController               = require('../controllers/userController');
const tokenController              = require('../controllers/tokenController');
const authenticate                 = require('../middleware/authMiddleware');

// In‑memory login attempt tracker.  Keys are remote IP addresses and
// values are arrays of timestamps (ms) for each login attempt.  In
// production you should use a more robust store (e.g. Redis) and
// consider clearing old keys periodically.
const loginAttempts = {};

/**
 * Rate limit middleware for login.  Limits each IP to a maximum of
 * 5 login attempts within a 15 minute window.  Exceeding this limit
 * returns a 429 error.  This implementation stores state in memory
 * and is reset on server restart.
 */
function loginRateLimiter(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;
  if (!loginAttempts[ip]) {
    loginAttempts[ip] = [];
  }
  // Remove timestamps older than the window
  loginAttempts[ip] = loginAttempts[ip].filter((ts) => now - ts < windowMs);
  if (loginAttempts[ip].length >= maxAttempts) {
    return res.status(429).json({ message: 'Too many login attempts, please try again later.' });
  }
  loginAttempts[ip].push(now);
  return next();
}

const router = express.Router();

// User registration.  Accepts name, email, phone and password in the
// request body and creates a new user account.  On success returns
// the JWT and user details.  For backwards compatibility this
// endpoint may also be referred to as `/auth/signup` by the front‑end.
router.post('/signup', userController.register);

// User login.  Returns an access token (short lived) and a refresh
// token (long lived) which can be exchanged later for a new access
// token.  Rate limiting is applied on a per‑IP basis.
router.post('/login', loginRateLimiter, userController.login);

// Refresh an access token using a valid refresh token.  The client
// must supply a JSON body with a `refreshToken` property.  On
// success returns a new pair of access/refresh tokens.  See
// controllers/tokenController.js for details.
router.post('/refresh-token', tokenController.refreshToken);

// Social sign‑in routes.  These endpoints accept a provider token
// (Google or Apple) and perform sign‑up or sign‑in on the server.
// The route names include `-signin` suffixes to match the paths
// expected by the front‑end (e.g. `/auth/google-signin`).
router.post('/google-signin', googleSignup);
router.post('/apple-signin', appleSignup);

// Backwards compatibility for older clients which posted to `/google`
// or `/apple` directly.  Keep these for now but prefer the more
// descriptive `-signin` endpoints above.
router.post('/google', googleSignup);
router.post('/apple', appleSignup);

// Logout simply acknowledges the client.  Because JWTs are
// stateless, there is no server‑side session to invalidate.  If you
// implement refresh tokens stored in a database you should revoke
// the provided token here.  The `authenticate` middleware ensures
// that only authenticated users can hit this endpoint.
router.post('/logout', authenticate, async (req, res) => {
  try {
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ message: 'Logout failed' });
  }
});

module.exports = router;
