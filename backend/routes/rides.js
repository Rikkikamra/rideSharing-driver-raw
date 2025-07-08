const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');
const { authenticate } = require('../middleware/auth');

// Get rides (filter by from, to, date, status, driver, etc.)
router.get('/', authenticate, async (req, res) => {
  try {
    const { from, to, date, status, driver } = req.query;
    const query = {};
    if (from) query.from = from;
    if (to) query.to = to;
    if (date) query.date = new Date(date);
    if (status) query.status = status;
    if (driver) query.driver = driver;
    const rides = await Ride.find(query).populate('driver', 'name profilePhoto').populate('riders', 'name');
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new ride (driver only)
router.post('/', authenticate, async (req, res) => {
  try {
    // Only allow drivers to create rides
    if (req.user.role !== 'driver') {
      return res.status(403).json({ message: 'Only drivers can create rides.' });
    }
    const { from, to, date, seatsAvailable, fare, vehicle } = req.body;
    if (!from || !to || !date || !seatsAvailable || !fare) {
      return res.status(400).json({ message: 'Missing required ride fields.' });
    }
    const ride = new Ride({
      from,
      to,
      date: new Date(date),
      driver: req.user._id,
      vehicle,
      seatsAvailable,
      fare,
      status: 'open',
      riders: []
    });
    await ride.save();
    res.status(201).json(ride);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update ride status (driver only)
router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const ride = await Ride.findById(id);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    if (String(ride.driver) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    ride.status = status;
    await ride.save();
    res.json(ride);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Book/join a ride (rider only)
router.post('/:id/book', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'rider') {
      return res.status(403).json({ message: 'Only riders can book rides.' });
    }
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    if (ride.status !== 'open' || ride.seatsAvailable <= 0) {
      return res.status(400).json({ message: 'Ride not available' });
    }
    if (ride.riders.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already booked this ride' });
    }
    ride.riders.push(req.user._id);
    ride.seatsAvailable -= 1;
    if (ride.seatsAvailable === 0) ride.status = 'full';
    await ride.save();
    res.json(ride);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;