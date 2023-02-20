const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// handle user signup on get
exports.signup_get = (req, res, next) =>{
    return res.render('signup_form',{ title: 'Sign Up'});
};

// handle user signup on post
exports.signup_post = [
    // validate and sanitize fields 
    body('username', 'Username must contain at least 3 characters.').trim().isLength({min:3}).escape(),
    body('email', 'Please enter a valid email.').isEmail().normalizeEmail(),
    body('password', 'Please enter a password with at least 6 characters.').isLength({min:6}),

    // process after validation
    async (req, res, next) =>{
        console.log(typeof req.body);
        console.log(req.body);
        // extract validation errors from request
        const errors = validationResult(req);

        // create user object
        // don't use 'const' when create new user because password
        // will be hashed and saved later. Instead, use 'let' to 
        // prevent creating same user twice with same information
        // stored in mongodb
        let user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });

        // there's error, re-render the form with escaped and trimmed data with error message
        if(!errors.isEmpty()){
            return res.render('signup_form',{
                user,
                errors: errors.array()
            });
        }
        // use try/catch to handle errors in async function
        // check if user already exists by email
        try {
            const user_found = await User.findOne({email: req.body.email});
            // email already exist
            if(user_found){
                return res.render('signup_form',{
                    user,
                    error: 'Email Already exists.'
                });
            }
            
            // hash password using bcrypt 
            const salt = await bcrypt.genSalt(10);
            console.log(`salt: ${salt}`);
            user.password = await bcrypt.hash(req.body.password, salt);
    
            // save user object
            await user.save((err)=>{
                if (err) return next(err);
            });
    
            const payload = {
                user: {id: user.id}
            };
    
            // get json web token
            jwt.sign(
                payload,
                'secret',
                { expiresIn: 10000},
                (err, token) =>{
                    if(err) return next(err);
                    // return res.status(200).json({token});
                    console.log(`token: ${token}`);
                    return res.redirect('/user/login');
                }
            );
        } catch (err){
            console.log(err.message);
            return next(err);
        }
    },
];

// handle user login on get
exports.login_get = (req, res, next) =>{
    return res.render('login_form',{ title: 'Log In'});
};

// handle user login on post
exports.login_post = [
    body('email', 'Please enter a valid email.').isEmail().normalizeEmail(),
    body('password', 'Please enter a password with at least 6 characters.').isLength({min:6}),

    // process after validation
    async (req, res, next) =>{
        // extract errors from request
        const errors = validationResult(req);

        // user input
        let input = new User({
            email: req.body.email
        });

        // there's error, re-render the form with escaped and trimmed data with error message
        if(!errors.isEmpty()){
            return res.render('login_form',{
                user: input,
                errors: errors.array()
            });
        }

        try {
            const user = await User.findOne({email: req.body.email});
            // user not exist
            if(!user){
                // return res.status(400).json({msg: 'User Not Exist'});
                
                return res.render('login_form',{
                    user: input,
                    error: 'User Not Exist.'
                });

            }
            // validate if password is correct
            const isCorrect = await bcrypt.compare(req.body.password, user.password);
            // if password is not correct
            if(!isCorrect){
                // return res.status(400).json({msg: 'Incorrect Password'});
                return res.render('login_form',{
                    user: input,
                    error: 'Incorrect Password.'
                });
            }

            const payload = {
                user: {id: user.id}
            };
            // get json web token
            jwt.sign(
                payload,
                'secret',
                { expiresIn: 3600},
                (err, token) =>{
                    if(err) return next(err);
                    console.log(`token: ${token}`);
                    // return res.status(200).json({token});
                    return res.render('home',{
                        title: 'Home Page',
                        error: 'Successfully logged in.'
                    });
                }
            );
        } catch(err){
            console.log(err);
            return res.status(500).json({msg: 'Sever Error'});
        }
    }
];

// get loggedIn user
exports.login_user_get = async (req, res, next) =>{
    // req.user is fetched after token 
    try {
        const found_user = await User.findById(req.user.id);
        if(!found_user) return res.send({message: 'Not authorized user'}); 
          
        return res.json(found_user.id);
    }catch(err){
        console.log(err);
        return res.send({ message: "Error in Fetching user" });
    }
    
    
};
