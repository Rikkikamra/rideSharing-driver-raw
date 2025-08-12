// backend/routes/fare.js

const express = require('express');
const router = express.Router();

/**
 * Calculate the haversine distance between two points on the Earth.
 * Returns the distance in miles.  If any input is missing or
 * invalid, returns null.  This helper is intentionally simple and
 * does not account for altitude or ellipsoidal corrections.
 */
function haversine(lat1, lon1, lat2, lon2) {
  if (
    [lat1, lon1, lat2, lon2].some((v) => typeof v !== 'number' || Number.isNaN(v))
  ) {
    return null;
  }
  const R = 3958.8; // Earth radius in miles
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// POST /api/fare/estimate
//
// Accepts `from` and `to` objects with latitude and longitude
// properties.  Calculates a simple estimated fare based on distance
// travelled and returns whether surge pricing is active.  If either
// coordinate is missing, responds with an error.  In production you
// would integrate a proper mapping service to compute time and
// distance and apply dynamic pricing rules.
router.post('/estimate', (req, res) => {
  try {
    const { from, to, riderType = 'regular', quietMode = false } = req.body;
    if (!from || !to) {
      return res.status(400).json({ success: false, message: 'Origin and destination required.' });
    }
    const { latitude: fromLat, longitude: fromLon } = from;
    const { latitude: toLat, longitude: toLon } = to;
    const distance = haversine(fromLat, fromLon, toLat, toLon);
    if (distance === null) {
      return res.status(400).json({ success: false, message: 'Invalid coordinates.' });
    }
    // Base fare in dollars
    let fare = 3.0;
    // Cost per mile; apply rider type multiplier
    let perMile = 1.5;
    if (riderType === 'luxury') perMile = 2.5;
    if (riderType === 'pool') perMile = 1.0;
    fare += distance * perMile;
    // Quiet mode surcharge (small extra fee for quiet rides)
    if (quietMode) fare += 1.0;
    // Simulate surge: 20% increase during peak times (random for demo)
    const surge = Math.random() < 0.1;
    if (surge) fare *= 1.2;
    return res.json({ success: true, estimatedFare: parseFloat(fare.toFixed(2)), surge });
  } catch (err) {
    console.error('fare estimate error:', err);
    return res.status(500).json({ success: false, message: 'Fare estimation failed.' });
  }
});

module.exports = router;