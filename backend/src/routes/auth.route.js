const express = require('express');
const router = express.Router();
const {signup} = require('../controllers/auth.controller');

router.get('/login', (req, res) => {
    res.send('Login route');
});

router.post('/signup', signup);
    

router.get('/logout', (req, res) => {   
    res.send('Logout route');
});



module.exports = router;