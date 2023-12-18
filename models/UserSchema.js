const mongoose = require('mongoose');

const users = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  projects: [{type: mongoose.Schema.Types.ObjectId, ref: "Projects"}]
});

const UserModel = mongoose.model('UserModel', users);

module.exports = UserModel;