const express = require('express');
const router = express.Router();
const {
  getAllVehicles,
  addVehicle,
  getVehicleByDriver
} = require('../controllers/vehicles');

router.get('/:driverId', getVehicleByDriver);
router.post('/add', addVehicle);
router.get('/', getAllVehicles);

module.exports = router;