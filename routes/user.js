const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

router.get('/signup', userController.signup_get);
router.post('/signup', userController.signup_post);
router.get('/login', userController.login_get);
router.post('/login', userController.login_post);
router.get('/me', auth, userController.login_user_get);


module.exports = router;