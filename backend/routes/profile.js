
const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const { verifyToken } = require('../middleware/authMiddleware');

// PUT /api/driver/profile
router.put('/profile', verifyToken, async (req, res) => {
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

    res.json({ message: 'Profile updated successfully', driver: updated });
  } catch (err) {
    console.error('Error updating driver profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
