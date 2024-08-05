const authService = require('../services/authService');

const apiKeyMiddleware = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return next(); 
  }

  try {
    const user = await authService.validateApiKey(apiKey);
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
};

module.exports = apiKeyMiddleware;
