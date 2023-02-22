const express = require('express');
const router = express.Router();

/* Get home page */
router.get('/', (req, res) => {
    res.render('home',{
        title: 'Home Page',
    });
});
/* Terms page */
router.get('/terms', (req, res) => {
    res.render('terms',{
        title: 'Terms Page',
    });
});
module.exports = router;