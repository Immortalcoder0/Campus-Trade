const Review = require('../models/Review');
const Booking = require('../models/Booking');
const { calculateTrustScore } = require('../utils/trustScore');

// @desc    Submit a review
// @route   POST /api/v1/reviews
// @access  Private
exports.createReview = async (req, res) => {
  try {
    const { booking_id, rating, comment } = req.body;

    const booking = await Booking.findById(booking_id).populate('item_id');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status !== 'Completed') {
      return res.status(400).json({ success: false, message: 'Reviews are only allowed on Completed bookings' });
    }

    // Determine roles
    const isBorrower = booking.borrower_id.toString() === req.user.id;
    const isLender = booking.item_id.owner_id.toString() === req.user.id;

    if (!isBorrower && !isLender) {
      return res.status(403).json({ success: false, message: 'Not authorized to review this booking' });
    }

    // Identify who is receiving the review
    const reviewee_id = isBorrower ? booking.item_id.owner_id : booking.borrower_id;

    // Check if a review from this user on this booking already exists
    // (TRD specifies one review per booking total for MVP, or one per booking *per user* if bi-directional.
    // The TRD Model schema has `booking_id: unique`. This strictly limits it to ONE review total per booking.
    // Let's adhere to the `unique` constraint in the TRD.)
    const existingReview = await Review.findOne({ booking_id });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'A review has already been submitted for this booking' });
    }

    const review = new Review({
      booking_id,
      reviewer_id: req.user.id,
      reviewee_id,
      rating,
      comment
    });

    await review.save();

    // Trigger asynchronous Trust Score recalculation for the reviewee
    calculateTrustScore(reviewee_id).catch(err => console.error('Trust Score Recalculation Error:', err));

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get user's reviews
// @route   GET /api/v1/reviews/user/:id
// @access  Public
exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee_id: req.params.id })
      .populate('reviewer_id', ['name'])
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
