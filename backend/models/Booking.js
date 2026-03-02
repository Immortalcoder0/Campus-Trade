const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  item_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  borrower_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Active', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  payment_type: {
    type: String,
    enum: ['Fiat', 'Barter'],
    required: true,
    default: 'Fiat'
  },
  total_amount: {
    type: Number
  },
  barter_terms: {
    type: String
  },
  payment_intent_id: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
