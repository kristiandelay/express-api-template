const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');

async function createRandomUser() {
  const newUser = new User({
    name: `User-${uuidv4()}`,
    phoneNumber: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    email: `user-${uuidv4()}@example.com`,
  });

  await newUser.save();
  return newUser;
}

async function getAllUsers() {
  return User.find();
}

module.exports = {
  createRandomUser,
  getAllUsers,
};
