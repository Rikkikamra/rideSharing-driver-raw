// backend/controllers/userController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// REGISTER NEW USER
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, passwordHash, phone });
    await newUser.save();

    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// LOGIN USER
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.isValidPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Issue JWT (adjust expiration/secret as needed)
    const token = jwt.sign(
      { id: user._id, role: user.role }, // <-- ADD role!
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        quietPreference: user.quietPreference,
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET CURRENT USER PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE QUIET PREFERENCE
exports.setPreferences = async (req, res) => {
  try {
    const { quiet } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { quietPreference: !!quiet },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ quiet: !!user.quietPreference });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET QUIET PREFERENCE
exports.getPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ quiet: !!user.quietPreference });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Old and new passwords are required.' });
    }
    const user = await User.findById(req.user.id).select('+passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update password.' });
  }
};
