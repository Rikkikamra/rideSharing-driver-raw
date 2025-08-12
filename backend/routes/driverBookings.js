
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Ride = require('../models/Ride');
const Vehicle = require('../models/Vehicle');

// Use the unified authentication middleware.  This module exports a
// single function that verifies the bearer token and attaches `req.user`.
const authenticate = require('../middleware/authMiddleware');

router.post('/driver-confirm', authenticate, async (req, res) => {
  try {
    const { rideId, vehicleId, acceptedReturn } = req.body;
    const driverId = req.user.id;

    if (!rideId || !vehicleId) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found.' });
    }

    // Prevent assigning multiple drivers
    if (ride.driverAssigned) {
      return res.status(400).json({ error: 'Ride already assigned to a driver.' });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle || vehicle.driver.toString() !== driverId) {
      return res.status(403).json({ error: 'Invalid vehicle for this driver.' });
    }

    // Create driver booking
    const booking = await Booking.create({
      ride: rideId,
      driver: driverId,
      vehicle: vehicleId,
      acceptedReturn,
      status: 'upcoming',
    });

    // Update ride
    ride.driverAssigned = true;
    ride.driver = driverId;
    ride.vehicle = vehicleId;
    await ride.save();

    res.status(201).json({ message: 'Ride confirmed', booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
