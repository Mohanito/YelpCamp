const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewController = require('../controllers/review');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../utilities/middleware');


router.post('/', isLoggedIn, validateReview, reviewController.createReview);

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, reviewController.deleteReview);

module.exports = router;