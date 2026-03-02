const express = require('express');
const router = express.Router();
const { createPaymentIntent, dummyPaymentSuccess } = require('../controllers/paymentController');
const auth = require('../middleware/authMiddleware');

router.post('/create-intent', auth, createPaymentIntent);
router.post('/dummy-success', auth, dummyPaymentSuccess);

module.exports = router;
