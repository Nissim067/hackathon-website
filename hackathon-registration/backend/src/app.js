const express = require('express');
const cors = require('cors');
const registrationRoutes = require('./routes/registrationRoutes');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const User = require('./models/User');
const Team = require('./models/Team');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', registrationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);

// General Stats Route
app.get('/api/stats', async (req, res) => {
  try {
    const registered = await User.countDocuments();
    const teamsFormed = await Team.countDocuments();
    const colleges = (await User.distinct('college')).length;
    res.json({ registered, teamsFormed, colleges });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Teams Routes
app.get('/api/teams', async (req, res) => {
  try {
    const teams = await Team.find().lean();
    const teamsResponse = teams.map(t => ({
      ...t,
      name: t.teamName,
      maxSize: 5
    }));
    res.json(teamsResponse);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

module.exports = app;
