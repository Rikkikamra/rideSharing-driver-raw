const express = require('express');
const router = express.Router();
const SpoofReport = require('../models/SpoofReport');

router.post('/spoofing', async (req, res) => {
  try {
    const { userId, timestamp, message } = req.body;
    const report = new SpoofReport({ userId, timestamp, message });
    await report.save();
    res.status(201).json({ message: 'Spoofing report submitted' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving report', error: err.message });
  }
});

module.exports = router;
