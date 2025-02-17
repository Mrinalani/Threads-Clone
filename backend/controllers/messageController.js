import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getRecipientSocketId, io } from "../socket/socket.js";
import {v2 as cloudinary} from 'cloudinary'

export const sendMessage = async(req, res) => {
try {
    const {recipientId, message}  = req.body;
    let {img}  = req.body;

    const senderId = req.user._id

    let conversation = await Conversation.findOne({
      participants: {$all: [senderId, recipientId]}
    })

    if(!conversation){
        conversation = new Conversation({
            participants: [senderId, recipientId],
            lastMessage: {
                text: message,
                sender: senderId
            }
        })
    }

    await conversation.save();

    if(img){
        const uploadedResponse = cloudinary.uploader.upload(img);
        img = (await uploadedResponse).secure_url;
    }

    const newMessage = new Message({
        conversationId: conversation._id,
        sender: senderId,
        text: message,
        img: img || ""
    });

     await Promise.all([
        newMessage.save(),
        conversation.updateOne({
            lastMessage:{
                text: message,
                sender: senderId
            }
        })
     ])   
     
     const recipientSocketId = getRecipientSocketId(recipientId);
    if(recipientSocketId){
        io.to(recipientSocketId).emit("newMessages", newMessage)
    }
     return res.status(201).json(newMessage)
} catch (error) {
    res.status(500).json({error: error.message})
    console.log("error in send message", error.message);
}
}

export const getMessages = async(req,res) => {
    try {
        const {otherUserId} = req.params;
        const userId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [userId, otherUserId]}
        })

        if(!conversation){
            return res.status(400).json({error: "conversation not found"})
        }

        const messages = await Message.find({
            conversationId: conversation._id
        })

        return res.status(200).json(messages)

    } catch (error) {
        res.status(500).json({error: error.message})
    console.log("error in get message", error.message);
    }
}

export const getConversations = async(req, res) => {
    const userId = req.user._id;
    try {
        const conversations = await Conversation.find({participants: userId}).populate({
            path: "participants",
            select: "username profilePic"
        })
        // remove current users from the participants
        conversations.forEach((conversation)=> {
            conversation.participants = conversation.participants.filter(
                participant => participant._id.toString() !== userId.toString()
            )
        })
        return res.status(200).json(conversations)
    } catch (error) {
        res.status(500).json({error: error.message})
        console.log("error in get message", error.message);
    }
}