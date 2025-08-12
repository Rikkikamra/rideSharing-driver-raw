// backend/controllers/authController.js

const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const jwtDecode = require('jwt-decode');
const User = require('../models/User');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Sign up or sign in via Apple ID.
 */
exports.appleSignup = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: 'Apple ID token is required.' });
    }

    const decoded = jwtDecode(idToken);
    const { email, sub: appleId, name: appleName } = decoded;
    if (!email) {
      return res.status(400).json({ message: 'Apple ID token must contain an email.' });
    }

    // Upsert user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name: appleName || 'Apple User',
        email,
        password: appleId + process.env.JWT_SECRET, // fallback
      });
      await user.save();
    }

    // Issue JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('authController.appleSignup error:', err);
    return res.status(500).json({ message: 'Apple sign-in failed.' });
  }
};

/**
 * Sign up or sign in via Google ID.
 */
exports.googleSignup = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: 'Google ID token is required.' });
    }

    // Verify token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, sub: googleId, name: googleName, picture } = payload;
    if (!email) {
      return res.status(400).json({ message: 'Google token did not contain an email.' });
    }

    // Upsert user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name: googleName || 'Google User',
        email,
        password: googleId + process.env.JWT_SECRET,
        profilePhoto: picture,
      });
      await user.save();
    }

    // Issue JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('authController.googleSignup error:', err);
    return res.status(500).json({ message: 'Google sign-in failed.' });
  }
};
