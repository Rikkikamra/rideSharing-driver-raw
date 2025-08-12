// backend/routes/drivers.js

const express = require('express');
const path = require('path');
const multer = require('multer');
const driverController = require('../controllers/driverController');
const authenticate  = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// ——— Multer storage & validation for profile images ———
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.PROFILE_IMAGE_UPLOAD_PATH || 'uploads/profile-images/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${req.user.id}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.png', '.jpg', '.jpeg'];
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg and .jpeg formats are allowed.'));
    }
  },
});

// ▶ Wrap multer to catch errors and return JSON
const uploadSingle = (fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

// ——— Public & Authenticated Driver Routes ———

router.post('/onboarding', authenticate, driverController.submitOnboarding);
router.get('/me', authenticate, driverController.getMyProfile);
router.get('/:userId', authenticate, driverController.getDriverByUserId);
router.put('/profile', authenticate, driverController.updateProfile);
router.post('/upload-profile-image', authenticate, uploadSingle('profileImage'), driverController.uploadProfileImage);

// Fetch authenticated driver’s performance score
router.get('/score', authenticate, driverController.getScore);

// Admin‑Only Routes
router.post('/:id/approve', authenticate, adminMiddleware, driverController.approveDriver);
router.post('/:id/reject', authenticate, adminMiddleware, driverController.rejectDriver);

// Fetch authenticated driver’s earnings (day/week/month)
router.get('/earnings', authenticate, driverController.getEarnings);

module.exports = router;
