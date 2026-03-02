const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  edu_email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[\w-\.]+@adityauniversity\.in$/, 'Please use an @adityauniversity.in email address']
  },
  password_hash: {
    type: String,
    required: true
  },
  email_verified: {
    type: Boolean,
    default: false
  },
  trust_score: {
    type: Number,
    default: 50
  },
  penalty_points: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
