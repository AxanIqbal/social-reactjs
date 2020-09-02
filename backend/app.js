const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const logger = require('morgan');
const mongoose = require('mongoose');
const fs = require('fs');
const usersRouter = require('./routes/users');
const placesRoutes = require('./routes/places')
const firebase = require('firebase')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mern.ctmrk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(r => console.log("Excess to Mongoose"))
    .catch(err => console.log(err));

let firebaseConfig = {
    apiKey: 'AIzaSyDoH0Tx-zlZ-hsttBrbIeVKxT8ym_3CORQ',
    storageBucket: 'my-places-f1210.appspot.com'
};
firebase.initializeApp(firebaseConfig);

let storage = firebase.storage();
console.log(storage)

app.use('/uploads/images', express.static(path.join('uploads','images')))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    next();
});

app.use('/api/users', usersRouter);
app.use('/api/places', placesRoutes)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    if (req.file) {
        fs.unlink(req.file.path, (err)=> {
            console.log(err);
        });
    }
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500).json(err.message || err);
    // res.render('error');
});

module.exports = app;
