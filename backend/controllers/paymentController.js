const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');

// @desc    Create Stripe Payment Intent
// @route   POST /api/v1/payments/create-intent
// @access  Private
exports.createPaymentIntent = async (req, res) => {
  try {
    const { booking_id } = req.body;

    const booking = await Booking.findById(booking_id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.borrower_id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized for this booking' });
    }

    if (booking.payment_type !== 'Fiat') {
      return res.status(400).json({ success: false, message: 'This booking does not require fiat payment' });
    }

    // Stripe expects amount in smallest currency unit (e.g., cents)
    const amountInCents = Math.round(booking.total_amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd', // Assuming USD for now
      metadata: { booking_id: booking._id.toString() }
    });

    res.status(200).json({
      success: true,
      client_secret: paymentIntent.client_secret
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Dummy Simulation Bypass for payments
// @route   POST /api/v1/payments/dummy-success
// @access  Private
exports.dummyPaymentSuccess = async (req, res) => {
  try {
    const { booking_id } = req.body;

    let booking = await Booking.findById(booking_id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // In a real flow, a webhook handles this. Here we manually patch it.
    booking.payment_intent_id = 'pi_dummy_simulation_' + Date.now();
    booking.status = 'Active'; // Activate the booking immediately for dummy testing
    await booking.save();

    res.status(200).json({ success: true, message: 'Dummy payment successful. Booking activated.', data: booking });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
