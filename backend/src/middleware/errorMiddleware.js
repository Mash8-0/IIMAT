/**
 * Global error handler — must be registered LAST in app.js.
 * Handles Prisma errors, Multer errors, and general errors.
 */
const errorHandler = (err, req, res, _next) => {
  console.error(`[ERROR] ${err.message}`);

  // Multer file size / type errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File too large. Max size is 5MB.' });
  }
  if (err.message?.startsWith('Invalid file type')) {
    return res.status(400).json({ success: false, message: err.message });
  }

  // Prisma unique constraint violation
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field';
    return res.status(409).json({ success: false, message: `${field} already exists` });
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    return res.status(404).json({ success: false, message: 'Record not found' });
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal server error' : err.message;
  res.status(statusCode).json({ success: false, message });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
};

module.exports = { errorHandler, notFoundHandler };
