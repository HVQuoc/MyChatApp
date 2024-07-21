const express = require("express")
const router = express.Router()
const { registerUser, authUser, allUsers } = require("../controllers/user.c")
const {protect} = require("../middleware/authMid")

router.route("/").post(registerUser).get(protect, allUsers)
router.post("/login", authUser) 

module.exports = router
