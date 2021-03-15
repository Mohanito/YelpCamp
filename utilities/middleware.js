const expressError = require('./expressError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { campgroundSchema, reviewSchema } = require('../schema');

// Joi validator middleware
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(elem => elem.message).join(',');
        console.log(msg);
        next(new expressError(msg, 400)); // throw new expressError(msg, 400);
    } else {
        next();
    }
}

// Joi validator middleware
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(elem => elem.message).join(',');
        throw new expressError(msg, 400);
    } else {
        next();
    }
}

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnToAfterLogin = req.originalUrl;
        req.flash('error', 'You must be signed in first!')
        return res.redirect('/login');
    }
    next();
}

// Authorization Middleware
const isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        next(new expressError('Permission Denied!', 403));
    }
    next();
}

const isReviewAuthor = async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        next(new expressError('Permission Denied!', 403));
    }
    next();
}

module.exports = { validateCampground, validateReview, isLoggedIn, isAuthor, isReviewAuthor };