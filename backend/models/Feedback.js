const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ride',
      required: true,
      index: true,
    },
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    feedbackType: {
      type: String,
      enum: ['driver', 'rider', 'ride'],
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    tags: [String],
    resolved: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

feedbackSchema.index({ ride: 1, fromUser: 1, toUser: 1 });
feedbackSchema.index({ feedbackType: 1, rating: -1 });

module.exports = mongoose.model('Feedback', feedbackSchema);