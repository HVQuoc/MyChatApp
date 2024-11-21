const express = require('express')
const { protect } = require('../middleware/authMid')
const { sendMessage, allMessages } = require('../controllers/message.c')
const router = express.Router()

router.route("/").post(protect, sendMessage)
router.route("/:chatId").get(protect, allMessages)

module.exports = router
