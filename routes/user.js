const express = require('express');
const router = express.Router();

// require controller modules
const userController = require('../controllers/userController');

router.post('/signup', userController.signup_post);


module.exports = router;