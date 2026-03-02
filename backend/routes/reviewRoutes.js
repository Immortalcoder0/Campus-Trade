const express = require('express');
const router = express.Router();
const { createReview, getUserReviews } = require('../controllers/reviewController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, createReview);
router.get('/user/:id', getUserReviews);

module.exports = router;
