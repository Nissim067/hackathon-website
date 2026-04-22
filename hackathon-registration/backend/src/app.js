const express = require('express');
const cors = require('cors');
const registrationRoutes = require('./routes/registrationRoutes');
const statsRouter = require('./routes/stats');
const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth');

const app = express();

// Configure CORS to allow frontend origins including deployed Vercel URL.
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
].filter(Boolean);

// Apply CORS policy with dynamic origin validation.
app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server and non-browser requests with no origin.
      if (!origin) return callback(null, true);
      // Allow only origins that are in the approved frontend list.
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // Reject origins not configured in environment variables.
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }),
);
app.use(express.json());

app.use('/api', registrationRoutes);
app.use('/api', statsRouter);
app.use('/api', adminRouter);
app.use('/api', authRouter);

module.exports = app;
