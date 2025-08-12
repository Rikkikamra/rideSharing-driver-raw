// backend/models/Feedback.js
const mongoose = require('mongoose');

const ALLOWED_BADGES = [
  'friendly',
  'punctual',
  'helpful',
  // add any additional badge IDs here to keep in sync with your frontend BADGES list
];

const feedbackSchema = new mongoose.Schema({
  ride: {
    type: mongoose.Schema.Types.ObjectId,
    // ▶ Changed ref from 'Trip' to 'Ride' to match the actual model name
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
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  badges: {
    type: [String],
    enum: ALLOWED_BADGES,
    default: [],
  },
  comments: {
    type: String,
    trim: true,
    default: null,
  },
  containsProfanity: {
    type: Boolean,
    default: false,
  },
  flaggedWords: {
    type: [String],
    default: [],
  },
  resolved: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
  versionKey: false,
});

// Ensure one feedback per (ride, fromUser) pair
feedbackSchema.index(
  { ride: 1, fromUser: 1 },
  { unique: true }
);

// Optimized lookup for toUser’s ratings
feedbackSchema.index(
  { toUser: 1, rating: -1 }
);

// ▶ OPTIONAL: Auto-set `containsProfanity` if any flaggedWords are present
feedbackSchema.pre('save', function(next) {
  this.containsProfanity = Array.isArray(this.flaggedWords) && this.flaggedWords.length > 0;
  next();
});

module.exports = mongoose.model('Feedback', feedbackSchema);
