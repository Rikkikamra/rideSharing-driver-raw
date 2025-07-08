

const jwtDecode = require('jwt-decode');

exports.appleSignup = async (req, res) => {
  try {
    const { idToken } = req.body;
    const decoded = jwtDecode(idToken);
    const { email, sub: appleId } = decoded;

    if (!email) return res.status(400).json({ message: 'Apple ID token must contain email' });

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ name: 'Apple User', email, password: appleId + process.env.JWT_SECRET });
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({ token, user });
  } catch (err) {
    console.error('Apple SignUp Error:', err);
    res.status(400).json({ message: 'Apple sign-up failed' });
  }
};
