const { UnauthorizedError } = require('express-jwt');

// Custom error handler for express-jwt errors
function errorHandler(err, req, res, next) {
  if (err instanceof UnauthorizedError) {
    return res.status(401).json({ error: 'Invalid or missing token' });
  }

  // Handle other errors
  return res.status(500).json({ error: err.message });
}

module.exports = errorHandler;
