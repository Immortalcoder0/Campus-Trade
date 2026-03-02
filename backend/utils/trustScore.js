const User = require('../models/User');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

/**
 * Recalculates the Trust Score for a given user according to the TRD formula:
 * T_score = (40 * R_completed/R_total) + (60 * L_completed/L_total) - P_penalties
 * 
 * @param {String} userId - The ID of the user to recalculate
 */
exports.calculateTrustScore = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    // 1. Calculate Review Ratio (R_completed / R_total)
    const allReviews = await Review.find({ reviewee_id: userId });
    const rTotal = allReviews.length;
    // R_completed: reviews with rating >= 4
    const rCompleted = allReviews.filter(r => r.rating >= 4).length;

    // Default to 1.0 (100%) if no reviews to avoid penalizing new users yet
    const reviewRatio = rTotal > 0 ? (rCompleted / rTotal) : 1.0;

    // 2. Calculate Lender Booking Completion Ratio (L_completed / L_total)
    // Find all items owned by user to check their bookings
    const Item = require('../models/Item'); // Lazy load to avoid circular deps if they exist
    const userItems = await Item.find({ owner_id: userId }).select('_id');
    const userItemIds = userItems.map(item => item._id);

    const allMyListingsBookings = await Booking.find({ item_id: { $in: userItemIds } });
    const lTotal = allMyListingsBookings.length;
    // L_completed: bookings that reached 'Completed' status
    const lCompleted = allMyListingsBookings.filter(b => b.status === 'Completed').length;

    // Default to 1.0 if no bookings hosted yet
    const listingRatio = lTotal > 0 ? (lCompleted / lTotal) : 1.0;

    // 3. Apply Penalties
    // Assuming user.penalty_points is an integer, TRD states: 5 points per penalty event
    const penalties = (user.penalty_points || 0) * 5;

    // 4. Calculate final score
    let baseScore = (40 * reviewRatio) + (60 * listingRatio);
    let finalScore = baseScore - penalties;

    // TRD: Clamp score between 0 and 100
    if (finalScore > 100) finalScore = 100;
    if (finalScore < 0) finalScore = 0;

    // TRD: New users with <= 3 transactions default to 50 if they have no explicit data causing a bump.
    // However, if ratios are perfect (1.0), baseScore is 100. Let's adjust for "New User" logic.
    // If they have 0 reviews and 0 bookings, the score should just be 50.
    if (rTotal === 0 && lTotal === 0) {
      finalScore = 50 - penalties;
      if (finalScore < 0) finalScore = 0;
    }

    // Round to 2 decimals
    finalScore = Math.round(finalScore * 100) / 100;

    // 5. Update User
    user.trust_score = finalScore;
    await user.save();

    return finalScore;
  } catch (err) {
    console.error('Error calculating trust score:', err.message);
  }
};
