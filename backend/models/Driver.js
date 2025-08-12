const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const driverSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    onboardingStatus: {
      type: String,
      enum: ['submitted', 'in_review', 'approved', 'rejected'],
      default: 'submitted'
    }, 
    rejectionReason: {
      type: String,
      default: ''
    },
    licenseExpiry: {
      type: Date,
      required: true,
    },
    vehicle: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      // required: true, // Not enforced on arrays by Mongoose
    }],
    approved: {
      type: Boolean,
      default: false,
      index: true,
    },
    backgroundCheckStatus: {
      type: String,
      enum: ['pending', 'passed', 'failed'],
      default: 'pending',
    },
    onboardingComplete: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    completedTrips: {
      type: Number,
      default: 0,
      min: 0,
    },
    earnings: {
      type: Number,
      default: 0,
      min: 0,
    },

    // IMAGE FIELDS
    profileImage: { type: String, default: '' },   // Driver's avatar
    pendingProfileImage: { type: String, default: '' }, // For admin approval
    profileImageStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
    },
    licenseImage: { type: String, default: '' }, // License scan upload

    // Tiers, statuses, security, notes
    driverTier: {
      type: String,
      enum: ['standard', 'premium', 'elite'],
      default: 'standard',
    },
    accountStatus: {
      type: String,
      enum: ['active', 'suspended', 'banned'],
      default: 'active',
      index: true,
    },
    pinHash: {
      type: String,
      select: false,
    },
    notes: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

driverSchema.index({ licenseNumber: 1 });
driverSchema.index({ accountStatus: 1 });
driverSchema.index({ approved: 1, onboardingComplete: 1 });

// Hash PIN before saving, if modified
driverSchema.pre('save', async function (next) {
  if (!this.isModified('pinHash')) return next();
  if (!this.pinHash) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.pinHash = await bcrypt.hash(this.pinHash, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// Method for validating PIN
driverSchema.methods.isValidPin = async function (pin) {
  return bcrypt.compare(pin, this.pinHash);
};

module.exports = mongoose.model('Driver', driverSchema);
