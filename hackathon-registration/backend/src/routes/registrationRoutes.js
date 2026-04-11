const express = require('express');
const { registerUser } = require('../controllers/registrationController');

const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: 'API is working' });
});

router.post('/register', registerUser);

module.exports = router;
