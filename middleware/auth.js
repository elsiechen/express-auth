// this auth module will be used to verify the token, 
// retrieve user based on token payload

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>{
    const token = req.header('token');
    if(!token) return res.status(401).json({message: 'Auth Error'});

    jwt.verify(token, 'secret', (err, decoded)=>{
        if(err) return next(err);

        req.user = decoded.user;
        // move to the next middleware
        next();
    });
}