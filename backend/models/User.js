const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    fcmToken: {
      type: String,
      default: ''
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    profilePhoto: String,
    role: {
      type: String,
      enum: ['rider', 'driver', 'admin'],
      default: 'rider',
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    kycStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    idVerificationPhoto: String,
    lastLogin: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    pushToken: String,
    referralCode: String,
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notificationPrefs: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true },
    },
    quietPreference: {
      type: Boolean,
      default: false,
    },
    createdVia: {
      type: String,
      enum: ['app', 'web', 'google', 'apple', 'admin'],
      default: 'app'
    },
    points: {
      type: Number,
      default: 0,
      min: 0,
    },
    badges: [String],
    notes: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for faster lookup
userSchema.index({ email: 1, isActive: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ referralCode: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// Method for validating password
userSchema.methods.isValidPassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);