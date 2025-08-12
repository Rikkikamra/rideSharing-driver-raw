const Vehicle = require('../models/Vehicle');

// Fetch verified vehicles for the authenticated driver.  Always use the
// authenticated user ID to prevent spoofing and avoid variable shadowing.
exports.getVerifiedVehicles = async (req, res) => {
  try {
    const driverId = req.user.id;
    const vehicles = await Vehicle.find({ driver: driverId, approved: true });
    return res.json({ success: true, vehicles });
  } catch (err) {
    console.error('Fetch vehicles error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch vehicles' });
  }
};

// Submit a new vehicle (with files)
exports.submitVehicle = async (req, res) => {
  try {
    const driverId = req.user?.id;
    if (!driverId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No driver ID' });
    }

    const registrationFilePath = req.files?.registrationFile?.[0]?.path || '';
    const insuranceFilePath = req.files?.insuranceFile?.[0]?.path || '';

    const newVehicle = new Vehicle({
      ...req.body,
      driver: driverId,
      verified: false,
      registrationFile: registrationFilePath,
      insuranceFile: insuranceFilePath
    });

    await newVehicle.save();
    res.json({ success: true, message: 'Vehicle submitted for review' });
  } catch (err) {
    console.error('Submit vehicle error:', err);
    res.status(500).json({ success: false, message: 'Vehicle submission failed' });
  }
};
