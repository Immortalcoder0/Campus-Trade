const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, updateBookingStatus } = require('../controllers/bookingController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, createBooking);
router.get('/me', auth, getMyBookings);
router.patch('/:id/status', auth, updateBookingStatus);

module.exports = router;
