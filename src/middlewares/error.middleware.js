const { error } = require('../utils/response.util');

/**
 * Global Express Error Handler Middleware.
 * Captures all uncaught application exceptions thrown inside handlers (controllers/services)
 * and intercepts them to return a standardised, clean JSON response format.
 *
 * @param {Error} err - Captured error instance containing stack trace and optional status code properties
 * @param {Object} req - Express Request object
 * @param {Object} res - Express Response object
 * @param {Function} next - Express Next function
 */
const errorMiddleware = (err, req, res, next) => {
  // Log the complete error stack trace to the console for development and production debugging
  console.error(err.stack);
  
  // Retrieve status code (default to 500 Internal Server Error if unspecified)
  const statusCode = err.statusCode || 500;
  
  // Retrieve error message (default to standard text if unspecified)
  const message = err.message || 'Internal Server Error';
  
  // Return the standard error envelope using the response helper
  return error(res, message, statusCode);
};

module.exports = errorMiddleware;
