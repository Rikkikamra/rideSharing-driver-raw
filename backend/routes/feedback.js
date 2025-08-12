// backend/routes/feedback.js
const express           = require('express');
const rateLimit         = require('express-rate-limit');
const authMiddleware    = require('../middleware/authMiddleware');
const validateFeedback  = require('../middleware/feedbackValidator');
const ctrl              = require('../controllers/feedbackController');

const feedbackLimiter = rateLimit({
  windowMs:  60_000,           // 1 minute
  max:       5,                // max 5 submissions per IP per window
  message:   { message: 'Too many feedback submissions, please try again later.' }
});

const router = express.Router();

// POST /api/feedback/:tripId
router.post(
  '/:tripId',
  authMiddleware,        // JWT check
  validateFeedback,      // payload schema validation
  feedbackLimiter,       // rate-limit abuse protection
  ctrl.submitTripFeedback
);

// GET /api/feedback/:tripId
router.get(
  '/:tripId',
  authMiddleware,
  ctrl.getTripFeedback
);

// GET /api/feedback/user/:userId
router.get(
  '/user/:userId',
  authMiddleware,
  ctrl.getUserRatings
);

// POST /api/feedback/app
//
// Handles general (non‑trip) feedback from authenticated users.  This
// route reuses the same validation and rate limiting middleware as
// trip feedback.  See submitAppFeedback in the controller for
// implementation details.
router.post(
  '/app',
  authMiddleware,
  feedbackLimiter,
  ctrl.submitAppFeedback
);

module.exports = router;
