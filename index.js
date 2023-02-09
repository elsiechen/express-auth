const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('../routes/user');
const app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// connect to MongoDB
// import mongoose module
const mongoose = require('mongoose');
const dev_db_url = "mongodb+srv://elsie915Atlas:thisOne2013@cluster0.tkrrrqs.mongodb.net/?retryWrites=true&w=majority";
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {useNewUrlParse: true, useUnifiedTopology: true});
// Get the default connection
const db = mongoose.connection;
// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, 'MongoDB connection error:'));


// port
const PORT = process.env.PORT || 4000;

// middleware
app.use(bodyParser.json());

// add user routes to middleware chain
app.use('/user', userRouter);

app.get('/', (req, res) =>{
    res.json({message: 'API Working'});
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.listen(PORT, (req, res) =>{
    console.log(`Server started at PORT ${PORT}`);
});

module.exports = index;