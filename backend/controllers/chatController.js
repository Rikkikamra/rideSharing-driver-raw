// updated_backend/controllers/chatController.js
//
// REST handlers for chat messages.  Uses the Trip alias to validate
// participation and supports multiple drivers.  Returns messages in a
// consistent shape for the front‑end.

const ChatMessage = require('../models/ChatMessage');
const Trip        = require('../models/Trip');

// GET /api/chats/trip/:tripId
exports.getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tripId } = req.params;
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    const driverIds = Array.isArray(trip.driver)
      ? trip.driver.map((d) => d.toString())
      : [trip.driver.toString()];
    const riderIds = Array.isArray(trip.riders)
      ? trip.riders.map((r) => r.toString())
      : [];
    const participants = new Set([...driverIds, ...riderIds]);
    if (!participants.has(userId)) return res.status(403).json({ message: 'Forbidden' });
    const msgs = await ChatMessage.find({ trip: tripId }).sort('createdAt').lean();
    const formatted = msgs.map((m) => ({
      id: m._id.toString(),
      from: driverIds.includes(m.fromUser.toString()) ? 'driver' : 'rider',
      text: m.text,
      time: m.createdAt.toISOString(),
    }));
    return res.json({ messages: formatted });
  } catch (err) {
    console.error('getMessages error', err);
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};

// POST /api/chats/trip/:tripId
exports.postMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tripId } = req.params;
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ message: 'Message text is required' });
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    const driverIds = Array.isArray(trip.driver)
      ? trip.driver.map((d) => d.toString())
      : [trip.driver.toString()];
    const riderIds = Array.isArray(trip.riders)
      ? trip.riders.map((r) => r.toString())
      : [];
    const participants = new Set([...driverIds, ...riderIds]);
    if (!participants.has(userId)) return res.status(403).json({ message: 'Forbidden' });
    const msg = await ChatMessage.create({
      trip: tripId,
      fromUser: userId,
      text: text.trim(),
    });
    return res.status(201).json({
      message: {
        id: msg._id.toString(),
        from: driverIds.includes(userId) ? 'driver' : 'rider',
        text: msg.text,
        time: msg.createdAt.toISOString(),
      },
    });
  } catch (err) {
    console.error('postMessage error', err);
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};