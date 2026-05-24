const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT for a given user.
 * Change JWT_SECRET and JWT_EXPIRES_IN in your .env file.
 */
const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

module.exports = generateToken;
