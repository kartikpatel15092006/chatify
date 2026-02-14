const User = require('../models/user.modle');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');

const signup = async (req, res) => {
const {fullName, email, password} = req.body;

try{
    if(!fullName||!email||!password){
        res.status(400).json({message:"All INPUTS ARE REQUIRE"})
    }
    if(password.length<6){
        res.status(400).json({message:"Password must be at least 6 characters"})
    }

    const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailregex.test(email)){
        res.status(400).json({message:"Invalid email format"})
    }
    
    
    const existingUser = await User.findOne({email});
    
    if(existingUser){
      return res.status(400).json({message:"Email already exists"})
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        fullName,
        email,
        password:hashedPassword
    })

    if(newUser){
        const token = jwt.sign({id:newUser._id}, process.env.JWT_SECRET, {expiresIn:"7d"})
        await newUser.save();
        res.cookie("token", token,{
            maxAge: 7*24*60*60*1000,
            httpOnly: true
        });
        res.status(201).json({message:"User created successfully"})

    }
}

catch(err){
    console.error("error in signup controller");
    res.status(500).json({message:"Internal server error"})
}



}



module.exports = {
    signup
}  