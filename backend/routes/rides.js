// backend/routes/rides.js (after)
const express = require('express');
const router = express.Router();
const rideController = require('../controllers/rideController');
// Import the authenticate middleware from the correct module.  The
// previous path (`../middleware/auth`) was incorrect and caused the
// server to crash at runtime.  See backend/middleware/authMiddleware.js
// for the implementation.
const authenticate = require('../middleware/authMiddleware');

// List/filter rides
router.get('/', authenticate, rideController.getRides);

// Get ride by ID
router.get('/:id', authenticate, rideController.getRideById);

// Create a new ride (driver only)
router.post('/', authenticate, rideController.createRide);

// Update ride status (driver only)
router.patch('/:id/status', authenticate, rideController.updateRideStatus);

// Book/join a ride (rider only)
router.post('/:id/book', authenticate, rideController.bookRide);

module.exports = router;
