const crypto = require('crypto');
const mongoose = require('mongoose');

const userScheme = mongoose.Schema({
  githubId: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: {
    type: String,
    required: true,
    unique: false,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  accessToken: {
    type: String,
    required: true,
    unique: true,
  },
});

const User = mongoose.model('User', userScheme);

module.exports = {User};
