const express = require('express');
const router = express.Router();
const {signup,login,logout} = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/middleware');
router.post('/login', login);

router.post('/signup', signup);
    

router.post('/logout', logout);

router.put("/updateprofile",authMiddleware, async (req,res)=>{
    res.status(200).json({message:"Profile updated successfully"})
})

module.exports = router;