const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Token = require('../models/token');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const secret = process.env.JWT_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;
const tokenExpiry = '1h'; // 1 hour
const refreshExpiry = '7d'; // 7 days

if (!secret || !refreshSecret) {
  throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be defined in the environment variables');
}

async function registerUser({ name, phoneNumber, email, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    phoneNumber,
    email,
    password: hashedPassword,
  });

  await newUser.save();
  return newUser;
}

async function authenticateUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  if (!user.password) {
    throw new Error('User password is missing');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);

  return { token, refreshToken };
}

function generateToken(user) {
  return jwt.sign({ userId: user._id, email: user.email }, secret, { expiresIn: tokenExpiry });
}

function generateRefreshToken(user) {
  const refreshToken = jwt.sign({ userId: user._id, email: user.email }, refreshSecret, { expiresIn: refreshExpiry });
  
  const tokenDocument = new Token({
    userId: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  tokenDocument.save();

  return refreshToken;
}

async function refreshAuthToken(refreshToken) {
  try {
    const payload = jwt.verify(refreshToken, refreshSecret);
    const user = await User.findById(payload.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const newToken = generateToken(user);
    return newToken;
  } catch (err) {
    throw new Error('Invalid refresh token');
  }
}

async function generateApiKey(userId) {
  const apiKey = crypto.randomBytes(30).toString('hex');
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  user.apiKey = apiKey;
  await user.save();

  return apiKey;
}

async function validateApiKey(apiKey) {
  const user = await User.findOne({ apiKey });
  if (!user) {
    throw new Error('Invalid API key');
  }
  return user;
}

module.exports = {
  registerUser,
  authenticateUser,
  refreshAuthToken,
  generateApiKey,
  validateApiKey,
};
