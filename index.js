const express = require('express');
const bodyParser = require('body-parser');

const app = express();

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

app.get('/', (req, res) =>{
    res.json({message: 'API Working'});
})

app.listen(PORT, (req, res) =>{
    console.log(`Server started at PORT ${PORT}`);
});