const express = require("express");
const router = express.Router();
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require("../controllers/chat.c")
const { protect } = require("../middleware/authMid")

router.route("/").post(protect, accessChat)
router.route("/").get(protect, fetchChats)
router.route("/group").post(protect, createGroupChat)
router.route("/rename").put(protect, renameGroup)
router.route("/group-add").put(protect, addToGroup)
router.route("/group-remove").put(protect, removeFromGroup)

module.exports = router;