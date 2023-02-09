const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// require controller modules
const userController = require('../controllers/userController');

router.post('/signup', userController.signup_post);
router.post('/login', userController.login_post);
router.get('/me', auth, userController.login_user_get);


module.exports = router;