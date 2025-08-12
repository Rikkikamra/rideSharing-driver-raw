// backend/routes/driverOnboarding.js
const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const {
  submitOnboarding,
  approveDriver,
  rejectDriver
} = require('../controllers/driverController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Submit a new application
router.post(
  '/submit',
  authMiddleware,
  submitOnboarding
);

// Admin-only: approve an application
router.post(
  '/approve/:id',
  authMiddleware,
  adminMiddleware,
  approveDriver
);

// Admin-only: reject an application
router.post(
  '/reject/:id',
  authMiddleware,
  adminMiddleware,
  rejectDriver
);

// Check current application status
router.get(
  '/status',
  authMiddleware,
  async (req, res) => {
    try {
      // Look up the driver by the `user` field instead of `userId`.  The
      // Driver model defines `user` as a reference to the User model,
      // whereas `userId` does not exist.  Without this fix the
      // endpoint always returns 404.
      const driver = await Driver.findOne({ user: req.user.id });
      if (!driver) return res.status(404).json({ message: 'Application not found' });
      res.json({
        onboardingStatus: driver.onboardingStatus,
        rejectionReason: driver.rejectionReason || ''
      });
    } catch (error) {
      console.error('Status route error:', error);
      res.status(500).json({ message: 'Failed to retrieve status', error: error.message });
    }
  }
);

module.exports = router;
