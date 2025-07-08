const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    discountType: {
      type: String,
      enum: ['percent', 'fixed'],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 1,
    },
    minFare: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxDiscount: {
      type: Number,
      min: 0,
    },
    usageLimit: {
      type: Number,
      default: 1,
      min: 1,
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    allowedUserTypes: {
      type: [String],
      enum: ['rider', 'driver', 'all'],
      default: ['rider'],
    },
    allowedUserIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    startDate: Date,
    expiry: Date,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

promoCodeSchema.index({ code: 1, active: 1 });
promoCodeSchema.index({ expiry: 1 });

module.exports = mongoose.model('PromoCode', promoCodeSchema);