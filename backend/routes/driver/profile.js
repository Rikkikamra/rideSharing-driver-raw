const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authenticate = require('../../../middleware/authenticate');
const Driver = require('../../../models/Driver');

// Storage config using multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../../uploads/pending');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `pending_${req.user.id}_${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

router.post('/upload-pending-image', authenticate, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const driver = await Driver.findById(req.user.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Save the pending image path (not replacing the approved profileImage)
    driver.pendingProfileImage = `/uploads/pending/${req.file.filename}`;
    await driver.save();

    return res.status(200).json({ message: 'Pending image uploaded successfully' });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;