const express = require('express');
const router = express.Router();

/* Get home page */
router.get('/', (req, res) => {
    res.render('home',{
        title: 'Home Page',
    });
});

module.exports = router;