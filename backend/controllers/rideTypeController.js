// backend/controllers/rideTypeController.js

const RideType = require('../models/RideType');

// GET /api/ridetypes
exports.getAllRideTypes = async (req, res) => {
  try {
    const rideTypes = await RideType.find({});
    res.json(rideTypes);
  } catch (err) {
    console.error('Error fetching ride types:', err);
    res.status(500).json({ message: 'Failed to fetch ride types' });
  }
};
