// backend/controllers/feedbackController.js
const Feedback = require('../models/Feedback');
const Trip     = require('../models/Trip');
const { logger, Sentry } = require('../utils/logger');

exports.submitTripFeedback = async (req, res) => {
  try {
    const driverId = req.user.id;
    const { tripId } = req.params;
    const { rating, badges = [], comments = null } = req.body;

    // (payload validation already done upstream)

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }
    if (String(trip.driver) !== driverId) {
      return res.status(403).json({ message: 'Not authorized.' });
    }
    const riderId = String(trip.rider);

    const feedback = await Feedback.findOneAndUpdate(
      { ride: tripId, fromUser: driverId },
      { ride: tripId, fromUser: driverId, toUser: riderId, rating, badges, comments },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return res.json({ success: true, feedback });
  } catch (err) {
    Sentry.captureException(err);
    logger.error('submitTripFeedback failed', { error: err, user: req.user.id, tripId: req.params.tripId });
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getTripFeedback = async (req, res) => {
  try {
    const { tripId } = req.params;
    const feedback = await Feedback.findOne({ ride: tripId })
      .select('-__v')
      .lean();
    if (!feedback) {
      return res.status(404).json({ message: 'No feedback for this trip.' });
    }
    return res.json({ feedback });
  } catch (err) {
    Sentry.captureException(err);
    logger.error('getTripFeedback failed', { error: err, tripId: req.params.tripId });
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserRatings = async (req, res) => {
  try {
    const { userId } = req.params;
    const list = await Feedback.find({ toUser: userId })
      .sort('-createdAt')
      .select('-__v')
      .lean();
    return res.json({ ratings: list });
  } catch (err) {
    Sentry.captureException(err);
    logger.error('getUserRatings failed', { error: err, userId: req.params.userId });
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * submitAppFeedback
 *
 * Allows authenticated users to submit general feedback about the app
 * rather than a specific trip.  The request body should contain a
 * `feedback` property (string).  The created record stores the
 * feedback in the Feedback collection with no associated ride.  Any
 * default rating/badge fields are omitted.  A success flag is
 * returned to the client on completion.
 */
exports.submitAppFeedback = async (req, res) => {
  try {
    const { feedback } = req.body;
    if (!feedback || typeof feedback !== 'string' || !feedback.trim()) {
      return res.status(400).json({ message: 'Feedback text is required.' });
    }
    const fb = new Feedback({
      ride: null,
      fromUser: req.user.id,
      toUser: null,
      rating: null,
      badges: [],
      comments: feedback.trim(),
    });
    await fb.save();
    return res.json({ success: true });
  } catch (err) {
    Sentry.captureException(err);
    logger.error('submitAppFeedback failed', { error: err, user: req.user.id });
    return res.status(500).json({ message: 'Server error' });
  }
};
