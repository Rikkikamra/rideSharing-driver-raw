const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: true,
      index: true,
    },
    make: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    model: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    year: {
      type: Number,
      required: true,
      min: 2000,
      max: new Date().getFullYear() + 1,
    },
    color: {
      type: String,
      trim: true,
      maxlength: 30,
    },
    licensePlate: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
      index: true,
      unique: true,
    },
    registrationExpiry: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    approved: {
      type: Boolean,
      default: false,
      index: true,
    },
    insuranceProvider: String,
    insuranceExpiry: Date,
    vehicleType: {
      type: String,
      enum: ['sedan', 'suv', 'van', 'hatchback', 'other'],
      default: 'sedan',
    },
    capacity: {
      type: Number,
      default: 4,
      min: 1,
      max: 8,
    },
    photos: [String],
    notes: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

vehicleSchema.index({ driver: 1, isActive: 1 });
vehicleSchema.index({ licensePlate: 1 });

module.exports = mongoose.model('Vehicle', vehicleSchema);