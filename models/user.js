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
    // Sometimes it is not included in the user info.
    required: false,
    unique: false,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    // Sometimes it is not included in the user info.
    unique: false,
  },
  accessToken: {
    type: String,
    required: true,
    unique: true,
  },
});

const User = mongoose.model('User', userScheme);

module.exports = {User};
