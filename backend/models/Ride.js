const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: true,
      index: true
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    riders: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    route: {
      from: { type: String, required: true, trim: true },
      to: { type: String, required: true, trim: true },
      stops: [{ type: String, trim: true }]
    },
    scheduledTime: {
      type: Date,
      required: true,
      index: true,
    },
    completedTime: Date,
    status: {
      type: String,
      enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
      default: 'scheduled',
      index: true,
    },
    fare: {
      type: Number,
      required: true,
      min: 0,
    },
    maxRiders: {
      type: Number,
      default: 3,
      min: 1,
      max: 3,
    },
    distance: Number,
    duration: Number,
    rideType: {
      type: String,
      enum: ['standard', 'premium', 'quiet', 'group'],
      default: 'standard',
    },
    driverNotes: String,
    riderNotes: String,
    surgePricing: {
      type: Boolean,
      default: false,
    },
    weather: {
      type: String,
      trim: true,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

rideSchema.index({ driver: 1, status: 1, scheduledTime: 1 });
rideSchema.index({ "route.from": 1, "route.to": 1, scheduledTime: 1 });

module.exports = mongoose.model('Ride', rideSchema);