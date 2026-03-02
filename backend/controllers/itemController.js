const Item = require('../models/Item');
const Booking = require('../models/Booking');

// @desc    Create new item
// @route   POST /api/v1/items
// @access  Private
exports.createItem = async (req, res) => {
  try {
    const { title, description, category, daily_price, accepts_barter, barter_description } = req.body;

    const newItem = new Item({
      owner_id: req.user.id,
      title,
      description,
      category,
      daily_price,
      accepts_barter,
      barter_description,
      image_urls: [] // Placeholder for Phase 4
    });

    const item = await newItem.save();
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all available items
// @route   GET /api/v1/items
// @access  Public
exports.getItems = async (req, res) => {
  try {
    const { category, q, barter } = req.query;

    let query = { is_available: true };
    if (category) query.category = category;
    if (barter === 'true') query.accepts_barter = true;
    if (q) query.title = { $regex: q, $options: 'i' };

    const items = await Item.find(query)
      .populate('owner_id', ['name', 'trust_score'])
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single item
// @route   GET /api/v1/items/:id
// @access  Public
exports.getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('owner_id', ['name', 'trust_score']);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update item
// @route   PUT /api/v1/items/:id
// @access  Private
exports.updateItem = async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (item.owner_id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'User not authorized to update this item' });
    }

    item = await Item.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({ success: true, data: item });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Soft delete item
// @route   DELETE /api/v1/items/:id
// @access  Private
exports.deleteItem = async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (item.owner_id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'User not authorized to delete this item' });
    }

    item.is_available = false;
    await item.save();

    res.status(200).json({ success: true, message: 'Item removed (soft delete)' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get item availability
// @route   GET /api/v1/items/:id/availability
// @access  Public
exports.getItemAvailability = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item || !item.is_available) {
      return res.status(404).json({ success: false, message: 'Item not found or unavailable' });
    }

    const bookings = await Booking.find({
      item_id: req.params.id,
      status: { $in: ['Pending', 'Active'] }
    }).select('start_date end_date -_id');

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
