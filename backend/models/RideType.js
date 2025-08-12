// backend/models/RideType.js

const mongoose = require('mongoose');

const rideTypeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  icon: String
}, { timestamps: true });

module.exports = mongoose.model('RideType', rideTypeSchema);
