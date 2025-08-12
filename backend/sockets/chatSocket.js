// updated_backend/sockets/chatSocket.js
//
// Production‑ready chat socket namespace.  This version supports multiple
// drivers, handles missing Trip model via alias, and includes better
// participant validation.  To scale horizontally, integrate a shared
// adapter (e.g. Redis) by configuring io.adapter() in server.js.

const ChatMessage = require('../models/ChatMessage');
// Trip is an alias to Ride; see updated_backend/models/Trip.js
const Trip        = require('../models/Trip');

module.exports = (io) => {
  // Namespace for chat
  const nsp = io.of('/chat');

  nsp.on('connection', (socket) => {
    const userId = socket.user.id;

    socket.on('joinTrip', async ({ tripId }) => {
      try {
        const trip = await Trip.findById(tripId);
        if (!trip) throw new Error('Trip not found');
        // Support arrays of drivers (e.g. co‑drivers) and riders
        const driverIds = Array.isArray(trip.driver)
          ? trip.driver.map((d) => d.toString())
          : [trip.driver.toString()];
        const riderIds = Array.isArray(trip.riders)
          ? trip.riders.map((r) => r.toString())
          : [];
        const participants = new Set([...driverIds, ...riderIds]);
        if (!participants.has(userId)) throw new Error('Not authorized');
        socket.join(tripId);
      } catch (err) {
        socket.emit('error', err.message);
      }
    });

    socket.on('leaveTrip', ({ tripId }) => {
      socket.leave(tripId);
    });

    socket.on('sendMessage', async ({ tripId, text }, callback) => {
      if (!text?.trim()) {
        return callback?.({ error: 'Message text required' });
      }
      try {
        const trip = await Trip.findById(tripId);
        if (!trip) throw new Error('Trip not found');
        const driverIds = Array.isArray(trip.driver)
          ? trip.driver.map((d) => d.toString())
          : [trip.driver.toString()];
        const riderIds = Array.isArray(trip.riders)
          ? trip.riders.map((r) => r.toString())
          : [];
        const participants = new Set([...driverIds, ...riderIds]);
        if (!participants.has(userId)) throw new Error('Not authorized');
        // Save message
        const msg = await ChatMessage.create({
          trip: tripId,
          fromUser: userId,
          text: text.trim(),
        });
        const payload = {
          id: msg._id.toString(),
          from: driverIds.includes(userId) ? 'driver' : 'rider',
          text: msg.text,
          time: msg.createdAt.toISOString(),
        };
        nsp.to(tripId).emit('newMessage', payload);
        return callback?.({ success: true, message: payload });
      } catch (err) {
        return callback?.({ error: err.message });
      }
    });
  });
};