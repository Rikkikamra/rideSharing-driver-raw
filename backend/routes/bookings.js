const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Ride = require('../models/Ride');
const User = require('../models/User');

// Create a new booking
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { ride, rider, pickupLocation, dropoffLocation, fare } = req.body;
    if (!ride || !rider || !pickupLocation || !dropoffLocation || !fare) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    // Check maxRiders for ride
    const rideObj = await Ride.findById(ride);
    if (!rideObj) return res.status(404).json({ error: 'Ride not found.' });
    const bookingCount = await Booking.countDocuments({ ride });
    if (bookingCount >= rideObj.maxRiders) {
      return res.status(400).json({ error: 'Ride is full.' });
    }
    const booking = await Booking.create({ ride, rider, pickupLocation, dropoffLocation, fare });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all bookings for a rider
router.get('/rider/:riderId', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ rider: req.params.riderId }).populate('ride');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all bookings for a driver (all rides by driver)
router.get('/driver/:driverId', authMiddleware, async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.params.driverId });
    const rideIds = rides.map(r => r._id);
    const bookings = await Booking.find({ ride: { $in: rideIds } }).populate('rider');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single booking by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('ride')
      .populate('rider');
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a booking status (confirm/cancel)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, cancelledBy, cancellationReason } = req.body;
    const allowed = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const update = { status };
    if (status === 'cancelled') {
      update.cancelledAt = new Date();
      if (cancelledBy) update.cancelledBy = cancelledBy;
      if (cancellationReason) update.cancellationReason = cancellationReason;
    }
    const booking = await Booking.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;