const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String
  },
  daily_price: {
    type: Number,
    required: true,
    min: [0.01, 'Price must be greater than zero']
  },
  accepts_barter: {
    type: Boolean,
    default: false
  },
  barter_description: {
    type: String
  },
  image_urls: {
    type: [String],
    default: []
  },
  is_available: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Item', ItemSchema);
