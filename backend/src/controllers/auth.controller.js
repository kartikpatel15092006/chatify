const User = require('../models/user.modle');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
const { sendWelcomeEmail } = require ('../emails/emailhandler');
const dotenv = require('dotenv');



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
    try{await sendWelcomeEmail(newUser.email, newUser.fullName, process.env.CLIENT_URL)}catch(err){
        console.error("Error sending welcome email:", err);
    }
}

catch(err){
    console.error("error in signup controller");
    res.status(500).json({message:"Internal server error"})
}



}

const login = async (req, res) => {
    const {email, password} = req.body;
    try{
        if(!email||!password){
            res.status(400).json({message:"All INPUTS ARE REQUIRE"})
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"user does not exist"})
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid email or password"})
        }
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:"7d"})
        res.cookie("token", token,{
            maxAge: 7*24*60*60*1000,
            httpOnly: true
        });
        res.status(200).json({message:"Login successful", user})
    }
    catch(err){
        console.error("error in login controller");
        res.status(500).json({message:"Internal server error"})}
}

const logout = (req, res) => {
  
    res.cookie("token", "", {
        maxAge: 0,
        httpOnly: true
    });
    res.status(200).json({message:"Logout successful"})
}

module.exports = {signup, login, logout}
     