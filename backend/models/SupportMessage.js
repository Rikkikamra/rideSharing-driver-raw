// backend/models/SupportMessage.js

const mongoose = require('mongoose');

/**
 * SupportMessage
 *
 * Stores chat messages between a user and support staff.  Each
 * document records the associated user, whether the message was
 * authored by the user or a support agent, the message text and
 * a timestamp.  Additional fields such as conversation IDs or
 * support agent IDs can be added as needed.
 */
const supportMessageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  from: { type: String, enum: ['user', 'support'], default: 'user' },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SupportMessage', supportMessageSchema);