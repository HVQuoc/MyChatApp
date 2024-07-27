const asyncHandler = require("express-async-handler")
const Chat = require("../models/chat.m");
const User = require("../models/user.m");
const Message = require("../models/message.m")

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body
    if (!userId) {
        console.log("userId is not sent with body");
        return res.status(400)
    }

    let theChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    }).populate("users", "-password").populate("latestMessage")

    theChat = await User.populate(theChat, {
        path: "latestMessage.sender",
        select: "name picture email"
    })

    if (theChat.length > 0) {
        res.send(theChat[0])
    } else {
        let chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        }

        try {
            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: createdChat._id })
                .populate("users", "-password");
            res.send(fullChat)

        } catch (err) {
            res.status(400)
            throw new Error(`Throw from chat.c ${err.message}`)
        }
    }

});

const fetchChats = asyncHandler(async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name picture email"
                })
                res.status(200).send(results)
            })

    } catch (err) {
        res.status(400)
        throw new Error(`Can not fetch chats for user ${req.user?.email}`)
    }
});

const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(401).json({ message: "Please fill in all the fields." })
    }

    let users = JSON.parse(req.body.users)

    if (users.length < 2) {
        return res.status(401).json({ message: "A group chat should contains more than 2 users." })
    }

    // create a group chat
    // add the user who send the request to create the group chat
    users.push(req.user)

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        })

        const groupChatWithData = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")

        res.status(200).send(groupChatWithData)
    } catch (err) {
        res.status(401)
        throw new Error(`Can not create the group chat. \nDetails: ${err.message}`)
    }
});


const renameGroup = asyncHandler(async (req, res) => {
    const { newName, chatId } = req.body
    try {
        const theChat = await Chat.find({ _id: chatId })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")

        if (!theChat) {
            res.status(404)
            throw new Error("The chat not found.")
        }
        theChat.name = newName
        theChat.save()
    } catch (err) {
        res.status(401)
        throw new Error(err.message)
    }
});

const addToGroup = asyncHandler(async (req, res) => {
    const {chatId, userId} = req.body
    const added = await Chat.findByIdAndUpdate(chatId,
        {
            $push: {users: userId},
        },
        {new: true}
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    if (!added) {
        res.status(404)
        throw new Error("Chat not found.")
    } else {
        res.json(added)
    }
});

const removeFromGroup = asyncHandler(async (req, res) => {
    const {chatId, userId} = req.body
    const removed = await Chat.findByIdAndUpdate(chatId,
        {
            $pull: {users: userId},
        },
        {new: true}
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    if (!removed) {
        res.status(404)
        throw new Error("Chat not found.")
    } else {
        res.json(removed)
    } 
});

module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup }