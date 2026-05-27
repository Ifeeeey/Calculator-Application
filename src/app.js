const express = require('express');
const path = require('path');
const { requestLogger } = require('./middleware/logger');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const calculatorRoutes = require('./routes/calculator.routes');
const historyRoutes = require('./routes/history.routes');

const app = express();

// ── Core Middleware ──────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(requestLogger);

// ── API Routes ───────────────────────────────────────────────
app.use('/api/calculate', calculatorRoutes);
app.use('/api/history',   historyRoutes);

// ── Error Handling ───────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
