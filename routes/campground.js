const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const campgroundController = require('../controllers/campground');
const { validateCampground, isLoggedIn, isAuthor } = require('../utilities/middleware');
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });

router.route('/')
    .get(campgroundController.index)
    .post(isLoggedIn, upload.array('image'), validateCampground, campgroundController.createCampground);

router.get('/new', isLoggedIn, campgroundController.renderNewForm);

router.route('/:id')
    .get(campgroundController.showCampground)
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, campgroundController.updateCampground)
    .delete(isLoggedIn, isAuthor, campgroundController.deleteCampground);

router.get('/:id/edit', isLoggedIn, isAuthor, campgroundController.renderEditForm);

module.exports = router;