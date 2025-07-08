const express = require('express');
const router = express.Router();
const Rewards = require('../models/Rewards');

router.get('/:userId', async (req, res) => {
  try {
    const rewards = await Rewards.findOne({ userId: req.params.userId });
    res.json(rewards || { points: 0, badges: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/claim', async (req, res) => {
  try {
    const { userId, points } = req.body;
    const rewards = await Rewards.findOneAndUpdate(
      { userId },
      { $inc: { points }, lastClaimed: new Date() },
      { upsert: true, new: true }
    );
    res.status(200).json(rewards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
