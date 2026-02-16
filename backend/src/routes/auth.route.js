const express = require('express');
const router = express.Router();
const {signup,login,logout,updateProfile} = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/middleware');
const arcjetProtection = require('../middleware/archjet.middleware');

router.use(arcjetProtection);

router.post('/login',  login);

router.post('/signup', signup);
    

router.post('/logout', logout);

router.put("/updateprofile",authMiddleware, updateProfile
)

router.get('/check', authMiddleware, (req, res) => {
    res.status(200).json({message:"You have accessed a protected route", user:req.user})})


module.exports = router;