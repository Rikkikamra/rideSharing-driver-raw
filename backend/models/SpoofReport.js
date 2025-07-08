const mongoose = require('mongoose');

const spoofReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ride',
    },
    reportedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    suspectedLocation: {
      type: String,
      required: true,
    },
    detectedBy: {
      type: String,
      enum: ['system', 'admin', 'driver', 'other'],
      default: 'system',
    },
    deviceInfo: {
      os: String,
      appVersion: String,
      deviceId: String,
      locationMethod: String,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'dismissed', 'confirmed'],
      default: 'pending',
      index: true,
    },
    actionTaken: String,
    adminReviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

spoofReportSchema.index({ user: 1, status: 1 });
spoofReportSchema.index({ ride: 1, status: 1 });

module.exports = mongoose.model('SpoofReport', spoofReportSchema);