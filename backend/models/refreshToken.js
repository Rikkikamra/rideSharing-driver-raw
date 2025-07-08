const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  device: { type: String, default: 'default' },
  createdAt: { type: Date, default: Date.now, expires: '7d' }
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);