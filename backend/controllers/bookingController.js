const Booking = require('../models/Booking');
const Ride = require('../models/Ride');

// Create a new booking (one-way or return)
exports.createBooking = async (req, res) => {
  try {
    // Accept new fields with backward compatibility
    const {
      ride,
      rider,
      pickupLocation,
      dropoffLocation,
      fare,
      isReturn = false,
      parentBookingId = null,
      discount = 0,
      bookingMethod,
      notes
    } = req.body;

    if (!ride || !rider || !pickupLocation || !dropoffLocation || !fare) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Check ride exists and maxRiders not exceeded
    const rideObj = await Ride.findById(ride);
    if (!rideObj) return res.status(404).json({ error: 'Ride not found.' });

    // Count existing bookings for this ride (exclude cancelled)
    const bookingCount = await Booking.countDocuments({
      ride,
      status: { $nin: ['cancelled'] }
    });
    if (bookingCount >= rideObj.maxRiders) {
      return res.status(400).json({ error: 'Ride is full.' });
    }

    // --- RETURN TRIP LOGIC ---
    let parentBooking = null;
    if (isReturn && parentBookingId) {
      parentBooking = await Booking.findById(parentBookingId);
      if (!parentBooking) {
        return res.status(404).json({ error: 'Parent booking not found for return trip.' });
      }
      // Prevent double return bookings
      const existingReturn = await Booking.findOne({
        parentBookingId,
        isReturn: true,
      });
      if (existingReturn) {
        return res.status(409).json({ error: 'Return booking already exists for this trip.' });
      }
    }

    // --- Discount Validation ---
    let validatedDiscount = 0;
    if (isReturn && discount > 0) {
      validatedDiscount = Math.min(discount, 10); // Cap at 10% (business rule)
    }

    // --- Fare Calculation ---
    const finalFare = (isReturn && validatedDiscount > 0)
      ? Math.round(fare * (1 - validatedDiscount / 100))
      : fare;

    // Compose booking object, always include all relevant fields for consistency
    const bookingObj = {
      ride,
      rider,
      pickupLocation,
      dropoffLocation,
      fare: finalFare,
      status: 'pending',
      paymentStatus: 'unpaid',
      bookingMethod: bookingMethod || 'app',
      notes: notes || '',
      // Return-trip fields:
      isReturn,
      parentBookingId: isReturn ? parentBookingId : null,
      discount: validatedDiscount,
    };

    const booking = await Booking.create(bookingObj);

    res.status(201).json({
      ...booking.toObject(),
      message: isReturn
        ? `Return trip booked with ${validatedDiscount}% discount.`
        : 'Booking created.',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- NO LOGIC REMOVED BELOW ---

// Get all bookings for a rider
exports.getBookingsForRider = async (req, res) => {
  try {
    const bookings = await Booking.find({ rider: req.params.riderId }).populate('ride');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all bookings for a driver
exports.getBookingsForDriver = async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.params.driverId });
    const rideIds = rides.map(r => r._id);
    const bookings = await Booking.find({ ride: { $in: rideIds } }).populate('rider');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('ride')
      .populate('rider');
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a booking status (confirm/cancel)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, cancelledBy, cancellationReason } = req.body;
    const allowed = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const update = { status };
    if (status === 'cancelled') {
      update.cancelledAt = new Date();
      if (cancelledBy) update.cancelledBy = cancelledBy;
      if (cancellationReason) update.cancellationReason = cancellationReason;
    }
    const booking = await Booking.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
