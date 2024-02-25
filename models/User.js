
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  handicapType: { 
    type: String, 
    enum: ['moteur', 'visuel', 'auditif', 'cognitif', 'autre'],
    required: true
  },
  verificationCode: {
    type: Number,
    required: false,
  },
  verificationCodeExpires: {
    type: Date,
    required: false,
  }

});

const User = mongoose.model('User', userSchema);

module.exports = User;