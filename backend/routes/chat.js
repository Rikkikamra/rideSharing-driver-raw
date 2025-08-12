// backend/routes/chat.js
const express          = require('express');
const router           = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const ctrl             = require('../controllers/chatController');

// Protect all chat HTTP routes
router.use(authenticate);

router.get('/trip/:tripId', ctrl.getMessages);
router.post('/trip/:tripId', ctrl.postMessage);

module.exports = router;
