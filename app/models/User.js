const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  dateofbirth: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);
