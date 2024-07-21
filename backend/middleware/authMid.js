const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")
const User = require("../models/user.m")

const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1]
            const jwtDecoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findOne({_id: jwtDecoded.id}).select("-password")
            next();
        } catch (err) {
            res.status(401)
            throw new Error("Not authenticated, token failed!");
        }
    }

    if (!token) {
        res.status(401)
        throw new Error("Not authenticated, no token!");
    }
});

module.exports = { protect }