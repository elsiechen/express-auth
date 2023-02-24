const express = require('express');
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var createError = require('http-errors');
const axios = require('axios');

// middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// parse application/json
app.use(bodyParser.json());

// connect to MongoDB
// import mongoose module
const mongoose = require('mongoose');
// Set up default mongoose connection
const dev_db_url = "mongodb+srv://elsie915Atlas:thisOne2013@cluster0.tkrrrqs.mongodb.net/?retryWrites=true&w=majority";
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
// Get the default connection
const db = mongoose.connection;
// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, 'MongoDB connection error:'));


// port
const PORT = process.env.PORT || 3000;



// add routes to middleware chain
app.use('/', indexRouter);
app.use('/user', userRouter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});
  
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });  

app.listen(PORT, (req, res) =>{
    console.log(`Server started at PORT ${PORT}`);
});

// app.post('/user/signup',(req, res)=>{
//     console.log('success post method');
// });

module.exports = app;