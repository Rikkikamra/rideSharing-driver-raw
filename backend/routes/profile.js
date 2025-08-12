
const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
// Use the authenticate middleware exported by authMiddleware.  The
// earlier version imported a non‑existent `verifyToken` which caused
// runtime errors.
const authenticate = require('../middleware/authMiddleware');

// PUT /api/profile
//
// Updates the authenticated driver's name, email and phone number.
// Mounted under `/api/profile` in server.js, so the full path is
// `/api/profile` when calling from the client.  Use authenticate
// middleware to ensure the user is logged in.
router.put('/', authenticate, async (req, res) => {
  try {
    const driverId = req.user.id;
    const { name, email, phone } = req.body;

    const updated = await Driver.findByIdAndUpdate(
      driverId,
      { name, email, phone },
      { new: true }
    ).select('-password');

    if (!updated) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    return res.json({ message: 'Profile updated successfully', driver: updated });
  } catch (err) {
    console.error('Error updating driver profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
