const express = require('express');
const router = express.Router();
// TODO: pricing logic
router.get('/', (req, res) => res.json({ message: 'Pricing endpoint placeholder' }));
module.exports = router;
