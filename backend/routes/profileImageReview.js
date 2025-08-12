
const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
// Use the authenticate middleware from authMiddleware.  The previous
// import referenced verifyToken, which does not exist.  See
// backend/middleware/authMiddleware.js for implementation details.
const authenticate = require('../middleware/authMiddleware');

// POST /api/profile/image-review
//
// This route is mounted under `/api/profile/image-review` in
// server.js.  Therefore its own path should be `/` so that the
// final route becomes exactly `/api/profile/image-review` when
// called from the client.  Defining an extra segment here would
// duplicate the path and break the endpoint.
router.post('/', authenticate, async (req, res) => {
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
