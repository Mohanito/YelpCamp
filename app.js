if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
};

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const helmet = require('helmet');
const User = require('./models/user');
// Custom Error Class
const expressError = require('./utilities/expressError');
// Routers
const campgroundRouter = require('./routes/campground');
const reviewRouter = require('./routes/review');
const userRouter = require('./routes/user');

const app = express();

const dburl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        console.log("Successfully connected to MongoDB.")
    })
    .catch((err) => {
        console.log("Error in MongoDB connection:");
        console.log(err);
    });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

// Helmet.js
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);

const secret = process.env.SECRET || '3f589c64293a98be717b3a2fe99d44dd0ebe68f08f36cf706dd0ebc138061dc5';

// Session & flash
const sessionConfig = {
    secret: secret,
    resave: false,
    saveUninitilized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 60 * 60 * 24  // the utc value seems odd
    },
    store: MongoStore.create({
        mongoUrl: dburl,
        // secret not in latest official docs?
        secret: secret,
        touchAfter: 24 * 3600
    })
}
app.use(session(sessionConfig));
app.use(flash());

// Passport-local for Auth
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', (req, res) => {
    res.render('home');
})

// Routers
app.use('/', userRouter);
app.use('/campgrounds', campgroundRouter);
app.use('/campgrounds/:id/reviews', reviewRouter);

app.all('*', (req, res, next) => {
    next(new expressError('Page not found', 404));
})

// Error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = 'Unknown error';
    }
    res.status(statusCode).render('error', { err });
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
})