const express = require('express');
const router = express.Router();
const PromoCode = require('../models/PromoCode');

router.post('/validate', async (req, res) => {
  try {
    const { code } = req.body;
    const promo = await PromoCode.findOne({ code });

    if (!promo || promo.usedCount >= promo.usageLimit || new Date(promo.expiryDate) < new Date()) {
      return res.status(400).json({ valid: false, message: 'Promo code invalid or expired' });
    }

    await PromoCode.updateOne({ code }, { $inc: { usedCount: 1 } });
    res.json({ valid: true, discount: promo.discountPercentage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
