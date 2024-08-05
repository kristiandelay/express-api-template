const authService = require('../services/authService');

async function register(req, res) {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: err.message });
  }
}

async function login(req, res) {
  try {
    const { token, refreshToken } = await authService.authenticateUser(req.body);
    res.status(200).json({ token, refreshToken });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(401).json({ error: err.message });
  }
}

async function refresh(req, res) {
  try {
    const { refreshToken } = req.body;
    const newToken = await authService.refreshAuthToken(refreshToken);
    res.status(200).json({ token: newToken });
  } catch (err) {
    console.error('Error refreshing token:', err);
    res.status(401).json({ error: err.message });
  }
}

async function generateApiKey(req, res) {
  try {
    const apiKey = await authService.generateApiKey(req.auth.userId);
    res.status(200).json({ apiKey });
  } catch (err) {
    console.error('Error generating API key:', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  register,
  login,
  refresh,
  generateApiKey,
};
