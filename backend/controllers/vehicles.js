const Vehicle = require('../models/Vehicle');

exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({});
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
};

exports.addVehicle = async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.status(201).json({ success: true, vehicle });
  } catch (err) {
    res.status(400).json({ error: 'Failed to add vehicle' });
  }
};

exports.getVehicleByDriver = async (req, res) => {
  try {
    const driverId = req.params.driverId;
    const vehicles = await Vehicle.find({ driverId });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vehicles for driver' });
  }
};