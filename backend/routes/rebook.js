const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Ride = require('../models/Ride'); // adjust model as needed
const User = require('../models/User'); // adjust model as needed

// Middleware to verify JWT and set req.user
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ success: false, message: 'Invalid token' });
    req.user = user; // user object should include user's _id or id
    next();
  });
}

// GET /api/rebook/suggestions
router.get('/suggestions', verifyToken, async (req, res) => {
  try {
    // Find the user's previous rides
    const previousRides = await Ride.find({ rider: req.user._id })
      .sort({ date: -1 })
      .limit(5);

    // Map rides to suggestions array with unique id
    const suggestions = previousRides.map(ride => ({
      id: ride._id,
      from: ride.from,
      to: ride.to,
      suggestedHour: new Date(ride.date).getHours(), // or use your preferred time logic
      // Add any other fields needed
    }));

    return res.json({ success: true, suggestions });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;
