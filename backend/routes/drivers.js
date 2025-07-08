const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');

router.get('/:userId', async (req, res) => {
  try {
    const driver = await Driver.findOne({ userId: req.params.userId });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const driver = new Driver(req.body);
    await driver.save();
    res.status(201).json(driver);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.post('/onboarding', async (req, res) => {
  try {
    const {
      fullName,
      dob,
      ssn,
      address,
      licenseNumber,
      expirationDate,
      issuingState,
      licensePhoto,
      consent
    } = req.body;

    if (
      !fullName || !dob || !ssn || !address || !licenseNumber ||
      !expirationDate || !issuingState || !licensePhoto || !consent
    ) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const newDriver = new Driver({
      fullName,
      dob,
      ssn,
      address,
      license: {
        number: licenseNumber,
        expirationDate,
        issuingState,
        photo: licensePhoto
      },
      consentAcknowledged: consent,
      onboardingStatus: 'submitted'
    });

    await newDriver.save();

    res.status(201).json({ success: true, message: 'Driver application submitted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});


module.exports = router;
