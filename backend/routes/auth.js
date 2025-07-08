
const express = require('express');
const router = express.Router();
const { signup } = require('../controllers/auth');

router.post('/signup', signup);

module.exports = router;


// Logout endpoint (optional cleanup logic)
router.post('/logout', authMiddleware, async (req, res) => {
  // You could track active tokens or blacklist here if needed
  return res.status(200).json({ message: 'Logged out successfully' });
});


const express = require('express');
const router = express.Router();
const { googleSignup } = require('../controllers/authController');

router.post('/google', googleSignup);

module.exports = router;


const { appleSignup } = require('../controllers/authController');
router.post('/apple', appleSignup);
