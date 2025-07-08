
const express = require('express');
const router = express.Router();
const Vehicle = require('../models/vehicle');

// Fetch verified vehicles for a driver
router.get('/', authMiddleware, '/', async (req, res) => {
  const { driverId } = req.query;
  try {
    const vehicles = await Vehicle.find({ driverId, verified: true });
    res.json({ success: true, vehicles });
  } catch (err) {
    console.error('Fetch vehicles error:', err);
    res.status(500).json({ success: false });
  }
});

// Submit a new vehicle
router.post('/', authMiddleware, '/', async (req, res) => {
  try {
    const newVehicle = new Vehicle({
      ...req.body,
      verified: false, // Pending admin verification
    });
    await newVehicle.save();
    res.json({ success: true, message: 'Vehicle submitted for review' });
  } catch (err) {
    console.error('Submit vehicle error:', err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
