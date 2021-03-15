const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        const review = new Review(req.body.review);
        review.author = req.user._id;
        campground.reviews.push(review);
        await review.save();
        await campground.save();
        req.flash('success', 'Created a new review!');
        res.redirect(`/campgrounds/${id}`);
    } catch (error) {
        next(error);
    }
};

module.exports.deleteReview = async (req, res, next) => {
    try {
        const { id, reviewId } = req.params;
        await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        req.flash('success', 'Successfully deleted a review!');
        res.redirect(`/campgrounds/${id}`);
    } catch (error) {
        next(error);
    }
};