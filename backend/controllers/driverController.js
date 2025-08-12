const mongoose = require('mongoose');
// The driver model file is named `Driver.js` (capital D).  Use the correct
// path to avoid runtime errors on case‑sensitive filesystems.  This also
// matches how other controllers import the model.
const Driver = require('../models/Driver');
const Trip = require('../models/Trip');  // Model for completed rides
const Feedback = require('../models/Feedback');

const {
  sendApplicationInReviewEmail,
  sendApplicationApprovedEmail,
  sendApplicationRejectedEmail,
} = require('../helpers/emailHelper');

const { sendPushNotification } = require('../helpers/pushHelper');

/**
 * Submit or update driver onboarding application.
 */
exports.submitOnboarding = async (req, res) => {
  try {
    const { name, email, fcmToken, ...otherData } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    const newDriver = await Driver.create({
      name,
      email,
      fcmToken,
      onboardingStatus: 'in_review',
      ...otherData,
    });

    // Notify via email and push
    await sendApplicationInReviewEmail(newDriver.email, newDriver.name);
    if (newDriver.fcmToken) {
      await sendPushNotification(
        newDriver.fcmToken,
        'Application Under Review',
        'Your driver application is now under review. We will notify you once it is processed.'
      );
    }

    return res.status(201).json({
      message: 'Application submitted successfully',
      driverId: newDriver._id,
    });
  } catch (error) {
    console.error('driverController.submitOnboarding error:', error);
    return res.status(500).json({ message: 'Failed to submit application.' });
  }
};

/**
 * Approve a driver application (admin only).
 */
exports.approveDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const driver = await Driver.findById(id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found.' });
    }

    driver.onboardingStatus = 'approved';
    await driver.save();

    await sendApplicationApprovedEmail(driver.email, driver.name);
    if (driver.fcmToken) {
      await sendPushNotification(
        driver.fcmToken,
        'Application Approved',
        'Congratulations! Your driver application has been approved.'
      );
    }

    return res.json({ message: 'Driver approved successfully.' });
  } catch (error) {
    console.error('driverController.approveDriver error:', error);
    return res.status(500).json({ message: 'Failed to approve driver.' });
  }
};

/**
 * Reject a driver application (admin only).
 */
exports.rejectDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason = '' } = req.body;
    const driver = await Driver.findById(id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found.' });
    }

    driver.onboardingStatus = 'rejected';
    driver.rejectionReason = reason;
    await driver.save();

    await sendApplicationRejectedEmail(driver.email, driver.name, reason);
    if (driver.fcmToken) {
      await sendPushNotification(
        driver.fcmToken,
        'Application Rejected',
        `Your application was rejected. Reason: ${reason}`
      );
    }

    return res.json({ message: 'Driver rejected successfully.' });
  } catch (error) {
    console.error('driverController.rejectDriver error:', error);
    return res.status(500).json({ message: 'Failed to reject driver.' });
  }
};

/**
 * Upload or change profile image (driver authenticated).
 */
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const pendingUrl = `/uploads/profile-images/${req.file.filename}`;
    const driver = await Driver.findById(req.user.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found.' });
    }

    driver.pendingProfileImage = pendingUrl;
    driver.profileImageStatus = 'pending';
    await driver.save();

    return res.json({
      pendingApproval: true,
      pendingProfileImage: pendingUrl,
    });
  } catch (error) {
    console.error('driverController.uploadProfileImage error:', error);
    return res.status(500).json({ message: 'Image upload failed.' });
  }
};

/**
 * Approve a pending profile image (admin only).
 */
exports.approveProfileImage = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found.' });
    }
    if (!driver.pendingProfileImage) {
      return res.status(400).json({ message: 'No pending profile image.' });
    }

    driver.profileImage = driver.pendingProfileImage;
    driver.pendingProfileImage = undefined;
    driver.profileImageStatus = 'approved';
    await driver.save();

    return res.json({
      success: true,
      profileImage: driver.profileImage,
    });
  } catch (error) {
    console.error('driverController.approveProfileImage error:', error);
    return res.status(500).json({ message: 'Approval failed.' });
  }
};

/**
 * Reject a pending profile image (admin only).
 */
exports.rejectProfileImage = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found.' });
    }

    driver.pendingProfileImage = undefined;
    driver.profileImageStatus = 'rejected';
    await driver.save();

    return res.json({ success: true });
  } catch (error) {
    console.error('driverController.rejectProfileImage error:', error);
    return res.status(500).json({ message: 'Rejection failed.' });
  }
};

/**
 * Get the authenticated driver’s profile.
 */
exports.getMyProfile = async (req, res) => {
  try {
    const driver = await Driver.findById(req.user.id).select('-password');
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found.' });
    }
    return res.json({ driver });
  } catch (error) {
    console.error('driverController.getMyProfile error:', error);
    return res.status(500).json({ message: 'Failed to fetch profile.' });
  }
};

/**
 * Update the authenticated driver’s email or phone.
 */
exports.updateProfile = async (req, res) => {
  try {
    const { email, phone } = req.body;
    const driver = await Driver.findByIdAndUpdate(
      req.user.id,
      { $set: { email, phone } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found.' });
    }
    return res.json({ driver });
  } catch (error) {
    console.error('driverController.updateProfile error:', error);
    return res.status(500).json({ message: 'Failed to update profile.' });
  }
};

/**
 * Fetch performance metrics for the authenticated driver.
 */
exports.getScore = async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const driverId = mongoose.Types.ObjectId(req.user.id);

    const completedRides = await Trip.countDocuments({
      driver: driverId,
      status: 'completed',
    });

    const [stats = {}] = await Feedback.aggregate([
      { $match: { toUser: driverId } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          positiveCount: {
            $sum: { $cond: [{ $gte: ['$rating', 4] }, 1, 0] },
          },
          reportCount: {
            $sum: { $cond: [{ $lte: ['$rating', 2] }, 1, 0] },
          },
        },
      },
    ]);

    const {
      avgRating = 0,
      positiveCount = 0,
      reportCount = 0,
    } = stats;

    return res.json({
      rating: Number(avgRating.toFixed(2)),
      completedRides,
      positiveFeedback: positiveCount,
      reports: reportCount,
    });
  } catch (error) {
    console.error('driverController.getScore error:', error);
    return res.status(500).json({ message: 'Failed to fetch driver score.' });
  }
};

/**
 * Compute the authenticated driver’s earnings for the current day, week and month.
 *
 * The earnings are calculated by summing the fare of all completed trips
 * (status `completed`) within each time window.  For example, the
 * `day` value includes all trips completed since midnight today.
 * If the driver has no trips during a window, the value will be 0.
 */
exports.getEarnings = async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const driverId = mongoose.Types.ObjectId(req.user.id);
    const now = new Date();
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(now);
    monthStart.setMonth(monthStart.getMonth() - 1);
    const trips = await Trip.find({
      driver: driverId,
      status: 'completed',
      completedTime: { $gte: monthStart },
    });
    let day = 0;
    let week = 0;
    let month = 0;
    for (const trip of trips) {
      const time = trip.completedTime || trip.updatedAt || trip.createdAt;
      const fare = trip.fare || 0;
      if (time >= monthStart) month += fare;
      if (time >= weekStart) week += fare;
      if (time >= dayStart) day += fare;
    }
    return res.json({ day, week, month });
  } catch (error) {
    console.error('driverController.getEarnings error:', error);
    return res.status(500).json({ message: 'Failed to fetch driver earnings.' });
  }
};