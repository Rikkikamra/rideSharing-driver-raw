// updated_backend/models/Trip.js
//
// The original project did not include a Trip model but referenced it in
// controllers and socket handlers.  This file provides a simple alias to
// the existing Ride model so that require('../models/Trip') returns the
// Ride schema.  If your data model differs (e.g., Trip is distinct from
// Ride), implement the actual Trip schema here instead of re‑exporting Ride.

const Ride = require('./Ride');
module.exports = Ride;