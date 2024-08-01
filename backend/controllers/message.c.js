
const asyncHandler = require('express-async-handler')
const Message = require('../models/message.m');
const User = require('../models/user.m');
const Chat = require('../models/chat.m');

const sendMessage = asyncHandler(async (req, res) => {
    const { chatId, content } = req.body
    if (!chatId || !content) {
        console.log("Invalid sent message");
        return res.status(400)
    }

    let newMessage = {
        sender: req.user._id,
        chat: chatId,
        content: content
    }

    try {
        let message = await Message.create(newMessage)
        message = await message.populate("sender", "name picture")
        message = await message.populate("chat")
        message = await User.populate(message, {
            path: "chat.users",
            select: "name email picture"
        })

        await Chat.findByIdAndUpdate(chatId, {
            lastestMessage: message
        })
        res.json(message)
    } catch (err) {
        res.status(400)
        throw new Error(err.message)
    }
})

const allMessages = asyncHandler(async (req, res) => {
    try {
        const chatId = req.params.chatId
        const messages = await Message.find({ chat: chatId })
            .populate("sender", "name email picture")
            .populate("chat")
        res.json(messages)
    } catch (err) {
        res.status(400)
        throw new Error(err.message)
    }
})

module.exports = { sendMessage, allMessages }
