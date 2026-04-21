// Import Express so we can create admin API routes.
const express = require('express');
// Import jsonwebtoken so we can verify JWT tokens.
const jwt = require('jsonwebtoken');
// Import the User model for user queries and admin checks.
const User = require('../models/User');
// Import the Team model for team-related counts.
const Team = require('../models/Team');

// Create a new router instance for admin endpoints.
const router = express.Router();

// Create middleware to verify JWT and attach the user.
async function requireAuth(req, res, next) {
  // Get the authorization header from the request.
  const authHeader = req.headers.authorization;
  // Check if the header exists and starts with "Bearer ".
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Return 401 when token is missing or malformed.
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Extract the token after the "Bearer " prefix.
  const token = authHeader.split(' ')[1];

  try {
    // Read the JWT secret from environment variables.
    const jwtSecret = process.env.JWT_SECRET;
    // Stop if the JWT secret is not configured.
    if (!jwtSecret) {
      // Return 500 for server misconfiguration.
      return res.status(500).json({ message: 'JWT secret is not configured' });
    }

    // Verify and decode the JWT token payload.
    const decoded = jwt.verify(token, jwtSecret);
    // Read possible user id keys from the decoded payload.
    const userId = decoded.userId || decoded.id || decoded._id;
    // Return 401 if token payload does not contain a user id.
    if (!userId) {
      // Return unauthorized for invalid token payload.
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find the user from database by id.
    const user = await User.findById(userId).lean();
    // Return 401 if the user does not exist anymore.
    if (!user) {
      // Return unauthorized when user lookup fails.
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Attach user to request so next middleware can use it.
    req.user = user;
    // Continue to the next middleware/route handler.
    return next();
  } catch (error) {
    // Return 401 if JWT verification fails.
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

// Create middleware to allow only admin users.
function requireAdmin(req, res, next) {
  // Check if request user exists and has isAdmin set to true.
  if (!req.user || req.user.isAdmin !== true) {
    // Return 403 when user is not an admin.
    return res.status(403).json({ message: 'Access denied' });
  }
  // Continue when the user is an admin.
  return next();
}

// Apply auth middleware to all routes in this router.
router.use(requireAuth);
// Apply admin check middleware to all routes in this router.
router.use(requireAdmin);

// Create GET /admin/stats route for admin dashboard stats.
router.get('/admin/stats', async (req, res) => {
  // Wrap all DB operations in try/catch for error handling.
  try {
    // Count total registered users in User collection.
    const totalRegistered = await User.countDocuments();
    // Count paid users by checking isPaid or paymentStatus fallback.
    const totalPaid = await User.countDocuments({
      $or: [{ isPaid: true }, { paymentStatus: 'paid' }],
    });
    // Count total teams from Team collection.
    const totalTeams = await Team.countDocuments();
    // Fetch latest 10 users with only requested fields.
    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email college isPaid paymentStatus createdAt')
      .lean();
    // Normalize paid field so response always includes isPaid.
    const recentRegistrations = recentUsers.map((user) => ({
      // Keep user name in response.
      name: user.name,
      // Keep user email in response.
      email: user.email,
      // Keep user college in response.
      college: user.college,
      // Provide boolean isPaid using fallback from paymentStatus.
      isPaid: user.isPaid === true || user.paymentStatus === 'paid',
      // Keep creation date in response.
      createdAt: user.createdAt,
    }));
    // Build college grouping pipeline and keep top 8 by count.
    const collegeBreakdown = await User.aggregate([
      // Group users by college and count users in each group.
      { $group: { _id: '$college', count: { $sum: 1 } } },
      // Sort groups from highest count to lowest count.
      { $sort: { count: -1 } },
      // Keep only the first 8 colleges.
      { $limit: 8 },
      // Rename _id to college and hide _id in output.
      { $project: { _id: 0, college: '$_id', count: 1 } },
    ]);

    // Return the final stats JSON object.
    return res.json({
      // Return total number of registered users.
      totalRegistered,
      // Return total number of paid users.
      totalPaid,
      // Return total number of teams.
      totalTeams,
      // Return last 10 registrations with requested fields.
      recentRegistrations,
      // Return top 8 colleges sorted by user count.
      collegeBreakdown,
    });
  } catch (error) {
    // Log server error for debugging.
    console.error('Failed to fetch admin stats:', error);
    // Return 500 when stats query fails.
    return res.status(500).json({ message: 'Failed to fetch admin stats' });
  }
});

// Create GET /admin/export route for CSV download.
router.get('/admin/export', async (req, res) => {
  // Wrap export logic in try/catch for safe failure.
  try {
    // Fetch all users and populate team name for CSV export.
    const users = await User.find({})
      .populate('team', 'teamName')
      .sort({ createdAt: -1 })
      .lean();
    // Define CSV header columns in required order.
    const headers = ['Name', 'Email', 'College', 'Team', 'Paid', 'Date'];
    // Start CSV rows with header line.
    const rows = [headers.join(',')];

    // Create helper to escape commas, quotes, and new lines safely.
    const escapeCsvValue = (value) => {
      // Convert null/undefined to empty string.
      const stringValue = value == null ? '' : String(value);
      // Escape inner double quotes by doubling them.
      const escaped = stringValue.replace(/"/g, '""');
      // Wrap value in double quotes for consistent CSV formatting.
      return `"${escaped}"`;
    };

    // Loop through every user to build CSV data rows.
    users.forEach((user) => {
      // Resolve team name or fallback to blank if no team.
      const teamName = user.team && user.team.teamName ? user.team.teamName : '';
      // Resolve paid value using isPaid with paymentStatus fallback.
      const paidValue = user.isPaid === true || user.paymentStatus === 'paid' ? 'Yes' : 'No';
      // Build one CSV row in requested column order.
      const row = [
        escapeCsvValue(user.name),
        escapeCsvValue(user.email),
        escapeCsvValue(user.college),
        escapeCsvValue(teamName),
        escapeCsvValue(paidValue),
        escapeCsvValue(user.createdAt ? new Date(user.createdAt).toISOString() : ''),
      ].join(',');
      // Push the row into CSV rows array.
      rows.push(row);
    });

    // Join all rows using newline separators.
    const csvContent = rows.join('\n');
    // Set content type to CSV so browser treats it correctly.
    res.setHeader('Content-Type', 'text/csv');
    // Set download filename for CSV export.
    res.setHeader('Content-Disposition', 'attachment; filename="users-export.csv"');
    // Send final CSV content as response body.
    return res.status(200).send(csvContent);
  } catch (error) {
    // Log export error for backend debugging.
    console.error('Failed to export admin CSV:', error);
    // Return 500 when CSV generation fails.
    return res.status(500).json({ message: 'Failed to export users CSV' });
  }
});

// Export admin router so app can mount it.
module.exports = router;
