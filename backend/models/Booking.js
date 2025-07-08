const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ride',
      required: true,
      index: true,
    },
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    pickupLocation: {
      type: String,
      required: true,
      trim: true,
    },
    dropoffLocation: {
      type: String,
      required: true,
      trim: true,
    },
    bookingTime: {
      type: Date,
      default: Date.now,
      required: true,
    },
    fare: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'failed', 'refunded'],
      default: 'unpaid',
    },
    cancelledAt: Date,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    cancellationReason: String,
    bookingMethod: {
      type: String,
      enum: ['app', 'web', 'admin'],
      default: 'app',
    },
    notes: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound index for ride and status (frequent lookup)
bookingSchema.index({ ride: 1, status: 1 });
// Rider recent bookings
bookingSchema.index({ rider: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);