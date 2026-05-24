const { forbidden } = require('../utils/responseHandler');

/**
 * Restrict access to specific roles.
 * Usage: authorize('super_admin', 'admin')
 */
const authorize = (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return forbidden(res, 'You do not have permission to perform this action');
    }
    next();
  };

module.exports = { authorize };
