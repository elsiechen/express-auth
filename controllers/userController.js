const User = require('../models/user');
const {validationResult, body} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// handle user signup on post
exports.signup_post = [
    body('username', 'Please enter a Username.').trim().isLength({min:1}).escape(),
    body('email', 'Please enter a valid email.').isEmail().normalizeEmail(),
    body('password', 'Please enter a password with at least 6 characters.').isLength({min:6}),

    // process after validation
    (req, res, next) =>{
        // extract validation errors from request
        const errors = validationResult(req);

        // create user object
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });

        // there's error, re-render the form with escaped and trimmed data with error message
        if(!errors.isEmpty()){
            res.render('signup_form',{
                title: 'Sign Up',
                user,
                errors: errors.array()
            });
            return;
        }

        // check if user already exists by email
        User.findOne({email: req.body.email}).exec((err, user_found)=>{
            if(err) return next(err);
            // email already exist
            if(user_found){
                return res.status(400).json({msg: 'User Already Exist.'});
            }
        });

        // hash password using bcrypt 
        const salt = bcrypt.genSalt(10);
        user.password = bcrypt.hash(req.body.password, salt);

        // save user object
        user.save((err)=>{
            if(err) return next(err);
            res.redirect('/login');
        });

        // get json web token
        jwt.sign(
            payload,
            'randomString',
            { expiresIn: 10000},
            (err, token) =>{
                if(err) return next(err);
                res.status(200).json({token});
            }
        );

    },

];

// handle user login on post
exports.login_post = [
    body('email', 'Please enter a valid email.').isEmail().normalizeEmail(),
    body('password', 'Please enter a password with at least 6 characters.').isLength({min:6}),

    // process after validation
    (req, res, next) =>{
        // extract errors from request
        const errors = validationResult(req);

        const { email, password } = req.body;

        // there's error, re-render the form with escaped and trimmed data with error message
        if(!errors.isEmpty()){
            res.render('login_form',{
                title: 'Log In',
                email: req.email,
                errors: errors.array()
            });
            return;
        }

        
        User.findOne({email: email}).exec((err, found_user)=>{
            if(err) return next(err);
            // user not exist
            if(found_user == null){
                return res.status(400).json({msg: 'User Not Exist'});
            }
            // validate if password is correct
            const isCorrect = bcrypt.compare(password, found_user.password);
            // if password is not correct
            if(!isCorrect){
                return res.status(400).json({msg: 'Incorrect Password'});
            }

            const payload = {
                user: {id: found_user.id}
            };
            // get json web token
            jwt.sign(
                payload,
                'randomString',
                { expiresIn: 3600},
                (err, token) =>{
                    if(err) return next(err);
                    res.status(200).json({token});
                }
            );
        });
    }
];

