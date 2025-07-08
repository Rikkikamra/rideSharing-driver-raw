
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendWelcomeEmail } = require('../utils/emailHelper');
const fetch = require('node-fetch');

exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password || !phone)
      return res.status(400).json({ message: 'Missing required fields' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, phone, password: hashedPassword, role: 'driver', kycStatus: 'pending' });
    await newUser.save();

    await sendWelcomeEmail(email, name);

    // Generate OTP after signup
    const otpRes = await fetch(`${process.env.BACKEND_URL}/api/2fa/request-2fa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, phone })
    });
    const otpData = await otpRes.json();
    console.log('OTP Sent:', otpData.success || otpData.message);


    const deviceInfo = req.headers['user-agent'];
    console.log('New Signup from Device:', deviceInfo);

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token, user: { id: newUser._id, email: newUser.email, name: newUser.name } });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Signup failed' });
  }
};
