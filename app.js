const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    flash = require('connect-flash'),
    methodOverride = require('method-override'),
    mongoose = require('mongoose'),
    User = require('./model/user'),
    seedDB = require('./seed.js');

const indexRoutes = require('./routes/index'),
    printRoutes = require('./routes/prints'),
    commentRoutes = require('./routes/comments');

mongoose.connect('mongodb://localhost/BookPhoto');
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extened: true }));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB();

app.use(require('express-session')({
    secret: 'secret word',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})

app.use('/', indexRoutes);
app.use('/prints', printRoutes);
app.use('/prints/:id/comments', commentRoutes);

app.listen(3000, function () {
    console.log('Activated');
});