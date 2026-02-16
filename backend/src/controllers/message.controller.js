const User = require('../models/user.modle');
const Message = require('../models/Message');

const getAllContacts = async (req, res) => {
    try{
        const userId = req.user._id;
        const filteruser = await User.find({_id:{ $ne: userId}}).select("-password");
        res.status(200).json(filteruser); 
    }
    catch(err){
        console.error("error in getAllContacts controller");
        console.log(err);
        res.status(500).json({message:"Internal server error"})
    }
}

const getAllMessages = async (req, res) => {
    try{
        const myid = req.user._id;
     const {id:usertochatid} = req.params;
const messages = await Message.find(
    { $or: [
        { senderId: myid, receiverId: usertochatid },
        { senderId: usertochatid, receiverId: myid }
      ]})
res.status(200).json(messages);
    }
    catch(err){
        console.error("error in getAllMessages controller");
        console.log(err);
        res.status(500).json({message:"Internal server error"})
    }
}

const sendMessage = async (req, res) => {
try{
    const {text,image} = req.body
    const{id:receiverId} = req.params
    const senderId = req.user._id

    let imageurl;
    if(image){
        const uploadResult = await cloudinary.uploader.upload(image);
        imageurl = uploadResult.secure_url;
    }

    const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image:imageurl
    })

    await newMessage.save();
    res.status(200).json({message:"Message sent successfully", newMessage})



}
catch(err){
     console.error("Error in sendMessage controller:", err);
        res.status(500).json({message:"Internal server error"})
    
}


}

const getChatpartners = async (req, res) => {

    try{
        const loggedInUserId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId },
                { receiverId: loggedInUserId }
            ]
        });

        const chatPartnerIds = [...new Set(messages.map((msg) => msg.senderId.toString()===loggedInUserId.toString()? msg.receiverId.toString() : msg.senderId.toString()))];  
        
const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select("-password");
res.status(200).json(chatPartners);
    }
    catch(err){
        console.error("Error in getChatpartners controller:", err);
        res.status(500).json({message:"Internal server error"})
    }




}

module.exports = {getAllContacts, getAllMessages, sendMessage, getChatpartners} 
