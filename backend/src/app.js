const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const programmeRoutes = require('./routes/programmeRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
// Change CLIENT_URL in .env to your frontend URL (e.g. https://iimat.edu.my)
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Static files (uploaded documents) ─────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'IIMAT API is running', timestamp: new Date().toISOString() });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/programmes', programmeRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);

// ── 404 & Error handlers (must be last) ──────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
