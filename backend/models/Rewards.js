const mongoose = require('mongoose');

const rewardsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    points: {
      type: Number,
      default: 0,
      min: 0,
    },
    badges: [{
      type: String,
      trim: true,
    }],
    rewardHistory: [{
      date: { type: Date, default: Date.now },
      type: { type: String, enum: ['earn', 'redeem', 'adjustment'] },
      points: Number,
      description: String,
    }],
    lastRedeemed: Date,
    currentTier: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum'],
      default: 'bronze',
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

rewardsSchema.index({ user: 1 });
rewardsSchema.index({ currentTier: 1 });

module.exports = mongoose.model('Rewards', rewardsSchema);