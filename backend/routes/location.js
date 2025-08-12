// backend/routes/location.js

const express = require('express');
const router = express.Router();

// Helper: Texas bounding box (very rough, you can replace with better geofence logic)
const TEXAS_BOUNDS = {
  minLat: 25.83,
  maxLat: 36.5,
  minLng: -106.65,
  maxLng: -93.51,
};

function isWithinTexas(lat, lng) {
  return (
    lat >= TEXAS_BOUNDS.minLat &&
    lat <= TEXAS_BOUNDS.maxLat &&
    lng >= TEXAS_BOUNDS.minLng &&
    lng <= TEXAS_BOUNDS.maxLng
  );
}

router.post('/location-check', async (req, res) => {
  const { latitude, longitude } = req.body;

  if (
    typeof latitude !== 'number' ||
    typeof longitude !== 'number'
  ) {
    return res.status(400).json({
      allowed: false,
      message: 'Invalid coordinates received.',
    });
  }

  // Replace with your real business logic!
  if (isWithinTexas(latitude, longitude)) {
    return res.json({ allowed: true });
  } else {
    return res.json({
      allowed: false,
      message: 'You must be physically located in Texas to use this feature.',
    });
  }
});

module.exports = router;
