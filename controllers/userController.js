const userService = require('../services/userService');

async function createUser(req, res) {
  try {
    const newUser = await userService.createRandomUser();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: 'Error creating user', details: err });
  }
}

async function getUsers(req, res) {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving users', details: err });
  }
}

module.exports = {
  createUser,
  getUsers,
};
