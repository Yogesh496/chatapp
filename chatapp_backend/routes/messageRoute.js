const express = require("express");
const {
  getUsersForSidebar,
  sendMessage,
  getMessages,
  deleteChat,
  blockUser,
  unblockUser,
  getBlockedUsers,
  markMessagesAsSeen,
  markMessagesAsUnread,
  unsendMessage,
} = require("../controller/messageController");
const protectRoute = require("../security/Auth");

const router = express.Router();

router.use(protectRoute);

router.get("/users", getUsersForSidebar);

router.get("/:id", getMessages);

router.post("/send/:id", sendMessage);

router.delete("/delete/:id", deleteChat);

router.post("/users/block/:id", blockUser);
router.post("/users/unblock/:id", unblockUser);
router.get("/users/blocked", getBlockedUsers);

router.post("/mark-seen/:id", markMessagesAsSeen);
router.post("/mark-unread/:id", markMessagesAsUnread);

// Add this with your other routes
router.delete("/unsend/:messageId", unsendMessage);

module.exports = router;
