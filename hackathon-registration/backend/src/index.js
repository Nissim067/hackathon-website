// Load environment variables before any app startup logic.
require('dotenv').config();

// Import configured Express app with routes and middleware.
const app = require('./app');
// Import MongoDB connection helper.
const connectDB = require('./config/db');

// Resolve server port from environment with fallback.
const PORT = process.env.PORT || 5000;

// Start backend server after successful database connection.
async function startServer() {
  try {
    // Connect to MongoDB first so APIs are ready with DB access.
    await connectDB();
    // Start listening for HTTP requests.
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    // Log startup error details and exit process safely.
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

// Execute server startup flow.
startServer();
