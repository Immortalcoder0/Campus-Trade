const Booking = require('../models/Booking');

/**
 * Checks if an item is available for the given date range.
 * Returns true if available (no overlaps), false otherwise.
 * Overlapping logic: An existing booking is 'Pending' or 'Active' and
 * (existing_start <= requested_end AND existing_end >= requested_start)
 */
const checkAvailability = async (item_id, start_date, end_date) => {
  const reqStart = new Date(start_date);
  const reqEnd = new Date(end_date);

  if (reqStart > reqEnd) {
    throw new Error('start_date cannot be after end_date');
  }

  const overlappingBookings = await Booking.find({
    item_id,
    status: { $in: ['Pending', 'Active'] },
    start_date: { $lte: reqEnd },
    end_date: { $gte: reqStart }
  });

  return overlappingBookings.length === 0;
};

module.exports = {
  checkAvailability
};
