const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Precomputed bcrypt hash for a dummy password used in fallback comparisons.
const DUMMY_PASSWORD_HASH = '$2b$10$4v6WFQyDU7NfKoJx4Q4Pxu4JiWf2rzNDO7xjoMnIKh4j/wcgUp3Oi';


router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    const jwtSecret = process.env.JWT_SECRET;

    if (!adminEmail || !adminPasswordHash || !jwtSecret) {
      return res.status(500).json({ message: 'Admin auth is not configured' });
    }

    const emailNormalized = String(email).trim().toLowerCase();
    const configuredEmail = String(adminEmail).trim().toLowerCase();
    const candidatePassword = String(password);

    const isEmailMatch = emailNormalized === configuredEmail;
    const hashToCompare = isEmailMatch ? String(adminPasswordHash) : DUMMY_PASSWORD_HASH;
    const isPasswordMatch = await bcrypt.compare(candidatePassword, hashToCompare);

    if (!(isEmailMatch && isPasswordMatch)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        email: emailNormalized,
        isAdmin: true,
        role: 'admin',
      },
      jwtSecret,
      { expiresIn: '12h' },
    );

    return res.json({
      token,
      user: {
        email: emailNormalized,
        isAdmin: true,
      },
    });
  } catch (error) {
    console.error('Admin login failed:', error);
    return res.status(500).json({ message: 'Login failed' });
  }
});

module.exports = router;
