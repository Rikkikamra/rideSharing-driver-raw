const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new booking
router.post('/', authMiddleware, bookingController.createBooking);

// Get all bookings for a rider
router.get('/rider/:riderId', authMiddleware, bookingController.getBookingsForRider);

// Get all bookings for a driver
router.get('/driver/:driverId', authMiddleware, bookingController.getBookingsForDriver);

// Get a single booking by ID
router.get('/:id', authMiddleware, bookingController.getBookingById);

// Update a booking status
router.patch('/:id/status', bookingController.updateBookingStatus);

// Delete a booking
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
