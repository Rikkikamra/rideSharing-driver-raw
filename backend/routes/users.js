const express = require('express');
const router  = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// User Registration
router.post('/register', userController.register);

// User Login
router.post('/login', userController.login);

// Get current user profile
router.get('/me', authMiddleware, userController.getProfile);

// Get Quiet Ride Preference
router.get('/preferences', authMiddleware, userController.getPreferences);

// Set Quiet Ride Preference
router.post('/preferences', authMiddleware, userController.setPreferences);

// Change password
router.post('/change-password', authMiddleware, userController.changePassword);

module.exports = router;
