// index.js — Entry point for the GroupProject Hub server
// Order matters: load env first, then connect DB, then start Express.

// 1. Load environment variables from server/.env into process.env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// --- Route imports (more will be added in Phase 3) ---
const healthRoutes = require('./routes/health');

// Create the Express application
const app = express();

// ── Security headers ──────────────────────────────────────────────────────────
// helmet sets sensible HTTP headers to protect against common web vulnerabilities
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────────────────
// Only allow requests from our frontend URL (set in .env as CLIENT_URL)
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);

// ── Body parser ───────────────────────────────────────────────────────────────
// Parse incoming JSON bodies; limit size to 100kb to prevent huge payloads
app.use(express.json({ limit: '100kb' }));

// ── HTTP request logger ───────────────────────────────────────────────────────
// morgan logs each request to the console in development (e.g. GET /api/health 200)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ── Rate limiter ──────────────────────────────────────────────────────────────
// Allow max 100 requests per IP per 15 minutes on all /api routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
  max: 100,                  // maximum requests per window per IP
  standardHeaders: true,     // return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please wait 15 minutes and try again.',
    errors: [],
  },
});
app.use('/api', apiLimiter);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/health', healthRoutes);
// (Phase 3 will add: projects, members, tasks, notes, milestones, dashboard, summary)

// ── 404 handler — catches any URL that did not match a route ──────────────────
app.use(notFound);

// ── Central error handler — must be last, after all routes and notFound ───────
app.use(errorHandler);

// ── Start server ONLY after the database is connected ────────────────────────
const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB(); // This exits the process if the DB connection fails

  const server = app.listen(PORT, () => {
    console.log(`🚀  Server running on http://localhost:${PORT}`);
    console.log(`    Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  // Graceful shutdown: if the process gets a termination signal (e.g. Ctrl+C),
  // close the HTTP server cleanly before exiting
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  });
}

// If a promise rejects somewhere and nobody catches it, log it clearly
process.on('unhandledRejection', (reason) => {
  console.error('❌  Unhandled Promise Rejection:', reason);
  process.exit(1);
});

// Kick everything off
startServer();

