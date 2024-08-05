const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  email: String,
  password: String,
  apiKey: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
