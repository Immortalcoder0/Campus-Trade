const Booking = require('../models/Booking');
const Item = require('../models/Item');
const { checkAvailability } = require('../utils/bookingUtils');

// @desc    Create new booking
// @route   POST /api/v1/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const { item_id, start_date, end_date, payment_type = 'Fiat', barter_terms } = req.body;

    const item = await Item.findById(item_id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (item.owner_id.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot book your own item' });
    }

    // Check overlaps natively
    const isAvailable = await checkAvailability(item_id, start_date, end_date);
    if (!isAvailable) {
      return res.status(409).json({ success: false, message: 'Item is not available for requested dates' });
    }

    // Calculate details
    const reqStart = new Date(start_date);
    const reqEnd = new Date(end_date);
    const timeDiff = Math.abs(reqEnd - reqStart);
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) || 1; // Minimum 1 day

    let total_amount = item.daily_price * days;
    if (payment_type === 'Barter') {
      total_amount = 0; // Barter has no fiat cost
    }

    const booking = new Booking({
      item_id,
      borrower_id: req.user.id,
      start_date,
      end_date,
      payment_type,
      total_amount,
      barter_terms
    });

    await booking.save();
    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get user's bookings (as borrower or lender)
// @route   GET /api/v1/bookings/me
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all items owned by current user to see bookings on their items
    const userItems = await Item.find({ owner_id: userId }).select('_id');
    const userItemIds = userItems.map(item => item._id);

    const bookings = await Booking.find({
      $or: [
        { borrower_id: userId },
        { item_id: { $in: userItemIds } }
      ]
    })
      .populate('item_id', ['title', 'daily_price', 'owner_id'])
      .populate('borrower_id', ['name', 'trust_score'])
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update booking status
// @route   PATCH /api/v1/bookings/:id/status
// @access  Private
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    let booking = await Booking.findById(req.params.id).populate('item_id');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const isBorrower = booking.borrower_id.toString() === req.user.id;
    const isLender = booking.item_id.owner_id.toString() === req.user.id;

    if (!isBorrower && !isLender) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this booking' });
    }

    // Basic logic for updating status
    // Only lender can confirm Pending -> Active
    // Either can Cancel if 'Pending'
    // For simplicity, we just allow status updates here if authorized.

    booking.status = status;
    await booking.save();

    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
