require('express-async-errors');
const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const aiRoutes = require('./routes/aiRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const errorHandler = require('./middleware/errorHandler');
const createRequestLogger = require('./middleware/requestLogger');
const ConsoleLogger = require('./logger/ConsoleLogger');

const app = express();

// Middleware
app.use(cors({ origin: env.CLIENT_ORIGIN }));
app.use(express.json());
app.use(createRequestLogger(new ConsoleLogger()));

// Routes
app.use('/api', aiRoutes);
app.use('/api', conversationRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Centralized error handling (must be last)
app.use(errorHandler);

module.exports = app;
