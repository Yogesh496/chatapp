const User1 = require("../model/credential.js");
const Message = require("../model/message.js");
const cloudinary = require("../config/cloudinary.js");
const { getReceiverSocketId, io } = require("../config/socket.js");
const User = require('../model/user');
const { importPublicKey, encryptMessage, importPrivateKey, decryptMessage } = require('../utils/encryption');

const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;


    const filteredUsers = await User1.find({ _id: { $ne: loggedInUserId } }).select("-password");


    const usersWithLatestMessage = await Promise.all(
      filteredUsers.map(async (user) => {
        const latestMessage = await Message.findOne({
          $or: [
            { senderId: loggedInUserId, receiverId: user._id },
            { senderId: user._id, receiverId: loggedInUserId },
          ],
          deletedBy: { $ne: loggedInUserId },
        })
          .sort({ createdAt: -1 })
          .limit(1);

        let latestMessageText = "No messages yet";
        let isUnread = false;


        if (latestMessage) {
          if (latestMessage.text) {
            latestMessageText = latestMessage.text;
          } else if (latestMessage.image) {
            latestMessageText = "📷 Photo";
          } else if (latestMessage.audio) {
            latestMessageText = "🎵 Audio";
          } else if (latestMessage.document) {
            latestMessageText = "📄 Document";
          }


          if (
            latestMessage.receiverId.toString() === loggedInUserId.toString() &&
            !latestMessage.isSeen
          ) {
            isUnread = true;
          }
        }

        return {
          ...user.toObject(),
          latestMessage: latestMessage ? latestMessageText : "No messages ",
          lastMessageTime: latestMessage ? latestMessage.createdAt : null,
          isUnread,
        };
      })
    );


    usersWithLatestMessage.sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));



    res.status(200).json(usersWithLatestMessage);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


const markMessagesAsSeen = async (req, res) => {
  try {
    const senderId = req.params.id;
    const receiverId = req.user._id;

    if (!senderId) {
      return res.status(400).json({ error: 'Sender ID is required' });
    }

    await Message.updateMany(
      { senderId, receiverId, isSeen: false },
      { $set: { isSeen: true } }
    );

    res.status(200).json({ success: true, message: "Messages marked as seen" });
  } catch (error) {
    console.error("Error marking messages as seen:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const markMessagesAsUnread = async (req, res) => {
  try {
    const { userId } = req.params;
    const loggedInUserId = req.user._id;


    await Message.updateMany(
      { senderId: userId, receiverId: loggedInUserId, isSeen: true },
      { $set: { isSeen: false } }
    );

    res.status(200).json({ message: "Messages marked as unread" });
  } catch (error) {
    console.error("Error marking messages as unread:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const getMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: otherUserId } = req.params;

    if (!otherUserId) {
      return res.status(400).json({ error: 'Other user ID is required' });
    }


    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId }
      ],
      deletedBy: { $ne: userId }
    }).sort({ createdAt: 1 });


    const user = await User1.findById(userId);
    let privateKey = user?.privateKey;


    const transformedMessages = [];
    if (privateKey) {
      const importedPrivateKey = await importPrivateKey(
        privateKey
          .replace('-----BEGIN PRIVATE KEY-----', '')
          .replace('-----END PRIVATE KEY-----', '')
          .replace(/\s/g, '')
      );
      for (const message of messages) {
        let msgObj = message.toObject();
        if (msgObj.isEncrypted) {
          let encryptedField = null;
          if (msgObj.receiverId.toString() === userId.toString()) {
            encryptedField = msgObj.encryptedForReceiver;
          } else if (msgObj.senderId.toString() === userId.toString()) {
            encryptedField = msgObj.encryptedForSender;
          }
          if (encryptedField) {
            try {
              msgObj.text = await decryptMessage(encryptedField, importedPrivateKey);
            } catch (e) {
              msgObj.text = '[Decryption failed]';
            }
          }
        }
        transformedMessages.push(msgObj);
      }
    } else {
      for (const message of messages) {
        transformedMessages.push(message.toObject());
      }
    }

    res.status(200).json(transformedMessages);
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text, image, audio, document, documentName } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;


    if (!text && !image && !audio && !document) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    if (!receiverId) {
      return res.status(400).json({ error: 'Receiver ID is required' });
    }


    const receiver = await User1.findById(receiverId);
    if (!receiver) {
      return res.status(400).json({ error: 'Receiver not found' });
    }


    const sender = await User1.findById(senderId);
    let encryptedForSender = "";
    let encryptedForReceiver = "";
    let isEncrypted = false;


    if (text && receiver.publicKey) {
      try {
        const pem = receiver.publicKey;
        const pemHeader = "-----BEGIN PUBLIC KEY-----";
        const pemFooter = "-----END PUBLIC KEY-----";
        let pemContents = pem.replace(pemHeader, "").replace(pemFooter, "").replace(/\s/g, "");
        const publicKey = await importPublicKey(pemContents);
        encryptedForReceiver = await encryptMessage(text, publicKey);
        isEncrypted = true;
      } catch (error) {
        console.error('Encryption error (receiver):', error);
      }
    }

    if (text && sender && sender.publicKey) {
      try {
        const pem = sender.publicKey;
        const pemHeader = "-----BEGIN PUBLIC KEY-----";
        const pemFooter = "-----END PUBLIC KEY-----";
        let pemContents = pem.replace(pemHeader, "").replace(pemFooter, "").replace(/\s/g, "");
        const publicKey = await importPublicKey(pemContents);
        encryptedForSender = await encryptMessage(text, publicKey);
        isEncrypted = true;
      } catch (error) {
        console.error('Encryption error (sender):', error);
      }
    }


    let imageUrl = "", audioUrl = "", documentUrl = "";

    if (image && typeof image === "string" && image.startsWith("data:image/")) {
      const uploadResponse = await cloudinary.uploader.upload(image, { resource_type: "image" });
      imageUrl = uploadResponse.secure_url;
    }

    if (audio && typeof audio === "string" && audio.startsWith("data:audio/")) {
      const uploadResponse = await cloudinary.uploader.upload(audio, { resource_type: "auto" });
      audioUrl = uploadResponse.secure_url;
    }

    if (document && typeof document === "string") {
      const uploadResponse = await cloudinary.uploader.upload(document, {
        resource_type: "raw",
        public_id: `documents/${Date.now()}-${documentName || 'document'}`,
        use_filename: true,
        unique_filename: false,
      });
      documentUrl = uploadResponse.secure_url;
    }


    const newMessage = new Message({
      senderId,
      receiverId,
      text: "",
      encryptedText: "",
      encryptedForSender,
      encryptedForReceiver,
      image: imageUrl || "",
      audio: audioUrl || "",
      document: documentUrl || "",
      documentName: documentName || "Document",
      isEncrypted,
      isSeen: false
    });


    await newMessage.save();


    const messageForClient = {
      id: newMessage._id,
      senderId: newMessage.senderId,
      receiverId: newMessage.receiverId,
      text: text || "",
      image: newMessage.image,
      audio: newMessage.audio,
      document: newMessage.document,
      documentName: newMessage.documentName,
      createdAt: newMessage.createdAt,
      isSeen: newMessage.isSeen
    };


    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", messageForClient);
    }

    res.status(201).json({
      message: 'Message sent successfully',
      data: messageForClient
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};


const deleteChat = async (req, res) => {
  try {
    const { id: userToDelete } = req.params;
    const loggedInUserId = req.user._id;


    await Message.updateMany(
      {
        $or: [
          { senderId: loggedInUserId, receiverId: userToDelete },
          { senderId: userToDelete, receiverId: loggedInUserId }
        ]
      },
      { $addToSet: { deletedBy: loggedInUserId } }
    );

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error in deleteChat:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


const blockUser = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const loggedInUserId = req.user._id;

    await User1.findByIdAndUpdate(
      loggedInUserId,
      { $addToSet: { blockedUsers: userId } },
      { new: true }
    );

    const updatedUser = await User1.findById(loggedInUserId).populate("blockedUsers", "fullName _id");
    res.status(200).json({ blockedUsers: updatedUser.blockedUsers });
  } catch (error) {
    console.error("Error blocking user:", error);
    res.status(500).json({ message: "Failed to block user" });
  }
};

const unblockUser = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const loggedInUserId = req.user._id;

    await User1.findByIdAndUpdate(
      loggedInUserId,
      { $pull: { blockedUsers: userId } },
      { new: true }
    );

    const updatedUser = await User1.findById(loggedInUserId).populate("blockedUsers", "fullName _id profilePic");
    const unblockedUser = await User1.findById(userId).select("fullName _id profilePic");

    return res.status(200).json({
      blockedUsers: updatedUser.blockedUsers,
      unblockedUser,
    });
  } catch (error) {
    console.error("Error unblocking user:", error);
    return res.status(500).json({ message: "Failed to unblock user" });
  }
};

const getBlockedUsers = async (req, res) => {
  try {
    const loggedInUser = await User1.findById(req.user._id).populate("blockedUsers", "fullName _id");
    res.status(200).json({ blockedUsers: loggedInUser.blockedUsers });
  } catch (error) {
    console.error("Error fetching blocked users:", error);
    res.status(500).json({ message: "Failed to fetch blocked users" });
  }
};

const unsendMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;


    const message = await Message.findById(messageId);


    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }


    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ error: "You can only unsend your own messages" });
    }


    await Message.findByIdAndDelete(messageId);


    const receiverSocketId = getReceiverSocketId(message.receiverId.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageUnsent", messageId);
    }

    res.status(200).json({ message: "Message unsent successfully" });
  } catch (error) {
    console.error("Error unsending message:", error);
    res.status(500).json({ error: "Failed to unsend message" });
  }
};

module.exports = {
  getUsersForSidebar,
  getMessages,
  sendMessage,
  deleteChat,
  blockUser,
  unblockUser,
  getBlockedUsers,
  markMessagesAsSeen,
  markMessagesAsUnread,
  unsendMessage,
};




































































































































