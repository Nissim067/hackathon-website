const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required to login.' });
    }

    const user = await User.findOne({ email: String(email).trim().toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Mock issuing JWT for demo purposes (no password check since it wasn't collected during registration)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });

    res.json({ success: true, token, user });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login.' });
  }
};
