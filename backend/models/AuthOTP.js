const mongoose = require('mongoose');

const AuthOTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp_hash: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: '15m' } // TTL index
  }
});

module.exports = mongoose.model('AuthOTP', AuthOTPSchema);
