require('dotenv').config();
const { expressjwt: jwt } = require('express-jwt');
const authService = require('../services/authService');

const secret = process.env.JWT_SECRET;
const algorithms = ['HS256'];

// Middleware to handle JWT and API Key
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const apiKey = req.headers['x-api-key'];

  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Handle Bearer Token (JWT)
    const token = authHeader.split(' ')[1];
    jwt({ secret, algorithms })(req, res, next);
  } else if (apiKey) {
    // Handle API Key
    try {
      const user = await authService.validateApiKey(apiKey);
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
  } else {
    return res.status(401).json({ error: 'No authorization token or API key provided' });
  }
};

module.exports = authMiddleware;
