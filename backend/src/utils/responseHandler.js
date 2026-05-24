/**
 * Standardised API response helpers.
 * All responses follow: { success, message, data?, meta? }
 */

const success = (res, data = null, message = 'Success', statusCode = 200, meta = null) => {
  const body = { success: true, message };
  if (data !== null) body.data = data;
  if (meta !== null) body.meta = meta;
  return res.status(statusCode).json(body);
};

const created = (res, data = null, message = 'Created successfully') =>
  success(res, data, message, 201);

const error = (res, message = 'Something went wrong', statusCode = 500, errors = null) => {
  const body = { success: false, message };
  if (errors !== null) body.errors = errors;
  return res.status(statusCode).json(body);
};

const notFound = (res, message = 'Resource not found') => error(res, message, 404);

const unauthorized = (res, message = 'Unauthorized') => error(res, message, 401);

const forbidden = (res, message = 'Forbidden') => error(res, message, 403);

const badRequest = (res, message = 'Bad request', errors = null) =>
  error(res, message, 400, errors);

module.exports = { success, created, error, notFound, unauthorized, forbidden, badRequest };
