
const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const { verifyToken } = require('../middleware/authMiddleware');

// POST /api/driver/profile-image-review
router.post('/profile-image-review', verifyToken, async (req, res) => {
  try {
    const driverId = req.user.id;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: 'No image provided' });
    }

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    driver.pendingProfileImage = imageUrl;
    await driver.save();

    res.json({ message: 'Image submitted for review. Admin will update it upon approval.' });
  } catch (err) {
    console.error('Image review submission error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
