// backend/routes/ridetypes.js

const express = require('express');
const router = express.Router();
const rideTypeController = require('../controllers/rideTypeController');

// Public: GET all ride types
router.get('/', rideTypeController.getAllRideTypes);

module.exports = router;
