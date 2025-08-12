const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicles');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/vehicles/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.fieldname + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Fetch verified vehicles for a driver
router.get('/', authMiddleware, vehicleController.getVerifiedVehicles);

// Submit a new vehicle (with files)
router.post(
  '/',
  authMiddleware,
  upload.fields([
    { name: 'registrationFile', maxCount: 1 },
    { name: 'insuranceFile', maxCount: 1 }
  ]),
  vehicleController.submitVehicle
);

module.exports = router;
