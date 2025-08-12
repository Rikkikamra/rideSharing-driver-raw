// backend/routes/faqs.js
const express = require('express');
const router = express.Router();
const Faq = require('../models/Faq');

// GET all FAQs (public)
router.get('/', async (req, res) => {
  try {
    const faqs = await Faq.find().sort({ createdAt: 1 }); // sort oldest to newest
    res.json({ faqs });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching FAQs.' });
  }
});

// (Optional) POST new FAQ (admin only)
// Add your admin middleware as needed
/*
router.post('/', adminMiddleware, async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ message: 'Both question and answer are required.' });
    }
    const faq = new Faq({ question, answer });
    await faq.save();
    res.status(201).json({ faq });
  } catch (err) {
    res.status(500).json({ message: 'Error adding FAQ.' });
  }
});
*/

module.exports = router;
