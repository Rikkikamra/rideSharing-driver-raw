// backend/routes/support.js

const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const SupportMessage = require('../models/SupportMessage');

/**
 * Support chat routes
 *
 * Provides a simple REST interface for users to read and send
 * messages to support agents.  Messages are associated with the
 * authenticated user and persisted in MongoDB.  In a real system
 * you would likely integrate with Socket.IO or a third‑party
 * customer support platform for real‑time messaging.
 */

// GET /api/support/messages
// Returns all support messages for the authenticated user, sorted
// newest first.
router.get('/messages', authenticate, async (req, res) => {
  try {
    const messages = await SupportMessage.find({ user: req.user.id })
      .sort('-createdAt')
      .lean();
    return res.json({ messages });
  } catch (err) {
    console.error('support GET messages error:', err);
    return res.status(500).json({ message: 'Failed to fetch support messages.' });
  }
});

// POST /api/support/messages
// Saves a new message from the user.  The request body must
// include a `message` field containing the text.  Returns the
// created message object.  Support messages from staff can be
// created by setting the `from` property to 'support' in the
// database or via a separate admin API.
router.post('/messages', authenticate, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ message: 'Message is required.' });
    }
    const msg = new SupportMessage({
      user: req.user.id,
      from: 'user',
      text: message.trim(),
    });
    await msg.save();
    return res.status(201).json({
      message: {
        id: msg._id.toString(),
        from: msg.from,
        text: msg.text,
        time: msg.createdAt,
      },
    });
  } catch (err) {
    console.error('support POST message error:', err);
    return res.status(500).json({ message: 'Failed to send support message.' });
  }
});

module.exports = router;