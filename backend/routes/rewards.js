const express = require('express');
const router = express.Router();
const Rewards = require('../models/Rewards');

/**
 * GET /rewards/:userId
 * Returns points, badges and current tier for the specified user.
 * If the user has no rewards record, default values are returned.
 */
router.get('/:userId', async (req, res) => {
  try {
    const rewards = await Rewards.findOne({ user: req.params.userId });
    if (!rewards) {
      return res.json({ points: 0, badges: [], tier: 'bronze' });
    }
    return res.json({
      points: rewards.points,
      badges: rewards.badges,
      tier: rewards.currentTier,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /rewards/claim
 * Increments the user’s points (e.g. when they earn a bonus).
 * It looks up the document by the correct `user` field rather than `userId`,
 * creates a record if none exists, and updates the `lastRedeemed` timestamp.
 */
router.post('/claim', async (req, res) => {
  try {
    const { userId, points } = req.body;
    const rewards = await Rewards.findOneAndUpdate(
      { user: userId },                      // match against `user` field
      { $inc: { points }, lastRedeemed: new Date() },
      { upsert: true, new: true }
    );
    return res.status(200).json(rewards);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
