const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

router.post('/', async (req, res) => {
  try {
    const { rating, comments, userId, driverId, containsProfanity, flaggedWords } = req.body;
    const feedback = new Feedback({
      rating,
      comments,
      userId,
      driverId,
      containsProfanity,
      flaggedWords,
    });
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving feedback', error: err.message });
  }
});

module.exports = router;
