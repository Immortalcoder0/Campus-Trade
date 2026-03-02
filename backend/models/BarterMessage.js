const mongoose = require('mongoose');

const BarterMessageSchema = new mongoose.Schema({
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  content: {
    type: String,
    required: true
  },
  is_system: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('BarterMessage', BarterMessageSchema);
