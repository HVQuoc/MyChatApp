const asyncHandler = require("express-async-handler");
const User = require("../models/user.m");
const generateToken = require("../config/generateToken")

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body
    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Please enter all the fields.")
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400)
        throw new Error(`User with email '${email} has been already existed.`)
    }

    // Otherwise, create new user
    const newUser = await User.create({
        name,
        email,
        password,
        pic
    });

    if (newUser) {
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            picture: newUser.picture,
            token: generateToken(newUser._id)
        });
    } else {
        res.status(400)
        throw new Error("Can not create new user with theses credentials.")
    }
});

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    console.log("e&p", email, password);
    const user = await User.findOne({ email })
    if (user) {
        // console.log("found user:", user);
        if (user.matchPassword(password)) {
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token: generateToken(user._id)
            })
        } else {
            res.status(401)
            throw new Error("Incorrect password")
        }
    } else {
        res.status(401)
        throw new Error("Incorrect email")
    }
});

const allUsers = asyncHandler(async (req, res) => {
    const searchKeyword = req.query.search 
    const mongoQuery = searchKeyword ?
    {
        $or: [
            {name: {$regex: searchKeyword, $options: "i"}},
            {email: {$regex: searchKeyword, $options: "i"}}
        ]
    }: {};

    const users = await User.find(mongoQuery).find({_id: {$ne: req.user._id}})
    res.send(users)
});

module.exports = { registerUser, authUser, allUsers }