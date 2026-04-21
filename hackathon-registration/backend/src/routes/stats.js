// Import Express so we can create a router for stats endpoints.
const express = require('express');
// Import the User model to query user-related counts.
const User = require('../models/User');
// Import the Team model to query team-related counts.
const Team = require('../models/Team');

// Create a new Express router instance for this file.
const router = express.Router();

// Create a public GET endpoint at /stats (mounted later under /api).
router.get('/stats', async (req, res) => {
  // Wrap database calls in try/catch to handle failures safely.
  try {
    // Count total registered users in the User collection.
    const registered = await User.countDocuments();
    // Count users who have isPaid set to true.
    const paid = await User.countDocuments({ isPaid: true });
    // Count total teams in the Team collection.
    const teams = await Team.countDocuments();
    // Find distinct college names from users to count unique colleges.
    const uniqueColleges = await User.distinct('college');
    // Convert the unique college array to a numeric count.
    const colleges = uniqueColleges.length;

    // Return the stats response in the exact required shape.
    return res.json({
      // Total number of users who registered.
      registered,
      // Total number of users marked as paid.
      paid,
      // Total number of teams created.
      teams,
      // Total number of unique college names.
      colleges,
    });
  } catch (error) {
    // Log the internal error for backend debugging.
    console.error('Failed to fetch public stats:', error);
    // Return a 500 response when any query fails.
    return res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

// Export this router so it can be mounted in the main app file.
module.exports = router;
