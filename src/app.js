const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const { NotFoundError } = require('./core/ApiError');
const session = require('express-session');
const flash = require('connect-flash');
const LocalStrategy = require('passport-local');
const passport = require('passport');
const User = require('./models/User');
const MongoStore = require('connect-mongo');

//Routes
const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');

// Mongo Store to save sessions to database.
const store = MongoStore.create({
    mongoUrl: process.env.MONGO_DATABASE_URL,
    touchAfter: 24 * 3600, // time period in seconds
    autoRemove: 'native',
    ttl: 14 * 24 * 60 * 60
});

const sessionConfig = {
    store: store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        // secure: true,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true, limit: '10mb', parameterLimit: 5000 }));
app.use(express.json({ parameterLimit: 5000, limit: '10mb' }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sessionConfig));
app.use(flash());

// Auth middlewares related to passport

// This tells express to use local strategy
passport.use(new LocalStrategy(User.authenticate()));

// This is used to serialize(store in string form) into the express session.
passport.serializeUser(User.serializeUser());

// This is user to desialize(change user in string format to actual js object) from express session.
passport.deserializeUser(User.deserializeUser());

// This tells express to use passport for authenctication.
app.use(passport.initialize());

// This tells express to use express session for passport persistent login.
app.use(passport.session());

// Middleware to add success, error and user to the res.locals
// This middleware should be added after : passport.deserializeUser(User.deserializeUser());
// Since User is populated in the request only after it is deserialized from the session
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});

app.get('/', (req, res) => {
    res.render('home');
});

app.use(productRoutes);
app.use('/products',reviewRoutes);
app.use(userRoutes);

app.all('*',(req, res, next)=> next(new NotFoundError('You are requesting a wrong path.')))

// custom error handling middleware
app.use((err, req, res, next) => {
    const { status = 500, message = 'Internal Server Error' } = err;
    res.status(status).render('error', { message });
});

module.exports = app;


