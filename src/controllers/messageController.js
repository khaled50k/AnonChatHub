const Message = require("../models/Message"); // Import your message model
const User = require("../models/User"); // Import your user model
const messageSchema = require("../validation/messageSchema");
const crypto = require("crypto"); // Import the crypto module
// Function to encrypt a message
function encryptMessage(message, key) {
  const cipher = crypto.createCipher("aes-256-cbc", key);
  let encryptedMessage = cipher.update(message, "utf8", "hex");
  encryptedMessage += cipher.final("hex");
  return encryptedMessage;
}

// Function to decrypt a message
function decryptMessage(encryptedMessage, key) {
  const decipher = crypto.createDecipher("aes-256-cbc", key);
  let decryptedMessage = decipher.update(encryptedMessage, "hex", "utf8");
  decryptedMessage += decipher.final("utf8");
  return decryptedMessage;
}

// Controller for creating a new encrypted message
async function createEncryptedMessage(req, res) {
  try {
    const {senderId}=req?.params
    // Check if a user is authenticated (you can use your authentication middleware)
    // const authenticatedUser = req.session; // Replace this with your authentication logic


    // if (authenticatedUser.authenticated) {
    //   // If authenticated, use the user's ID as the sender
    //   // senderId = authenticatedUser.user._id;
    // } else {
    //   // If not authenticated, senderId will remain undefined (or null)
    // }

    // Validate message input
    const { error, value } = messageSchema.validate(req.body);

    // Check for validation errors
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { content, recipient } = value;
    // Fetch the recipient's decryption key from the user model
    const recipientUser = await User.findById(recipient);
    const recipientDecryptionKey = recipientUser.decryptionKey;

    // Encrypt the message content using the recipient's decryption key
    const encryptedContent = encryptMessage(content, recipientDecryptionKey);

    // Create a new message using the encrypted chunks, senderId, and recipient
    const newMessage = new Message({
      content: encryptedContent,
      sender: senderId,
      recipient: recipient,
    });
    await newMessage.save();
   
    res.status(201).json({ message: "Encrypted message created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Message creation failed" });
  }
}

// Controller for updating a message (assuming you have message ID in the request params)
async function updateMessage(req, res) {
  try {
    const messageId = req.params.id;
    const { content } = req.body;

    // Validate message input
    const { error, value } = messageSchema.validate({ content });

    // Check for validation errors
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Find the message by ID and update its content
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { content: value.content },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json({ message: "Message updated successfully", updatedMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Message update failed" });
  }
}

// Controller for getting all messages
async function getAllMessages(req, res) {
  try {
    const messages = await Message.find();

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to retrieve messages" });
  }
}

// Controller for deleting a message (assuming you have message ID in the request params)
async function deleteMessage(req, res) {
  try {
    const messageId = req.params.id;

    // Find and delete the message by ID
    const deletedMessage = await Message.findByIdAndDelete(messageId);

    if (!deletedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Message deletion failed" });
  }
} // Controller for getting and decrypting messages for a specific user (recipient)
async function getAllUserMessagesDecrypted(req, res) {
  try {
    const user = req.session.user; // Assuming you have a route parameter for the user ID

    // Retrieve encrypted messages for the user and populate the sender field
    const encryptedMessages = await Message.find({
      recipient: user._id,
    })
      .populate({
        path: "sender",
        select: "_id username", // Select only the necessary fields from the sender
      })
      .populate("recipient", "_id decryptionKey");
    const recipientDecryptionKey =
      encryptedMessages[0]?.recipient.decryptionKey;

    // Decrypt and format the messages
    const decryptedMessages = encryptedMessages.map((message) => {
      const sender = message.sender
        ? {
            _id: message.sender._id,
            username: message.sender.username,
          }
        : null; // Extract the sender's data if it exists

      const decryptedContent = decryptMessage(
        message.content,
        recipientDecryptionKey
      );
      return {
        content: decryptedContent,
        sender: sender, // Include the sender if it exists
      };
    });

    res.json(decryptedMessages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to retrieve and decrypt messages" });
  }
}

module.exports = {
  createEncryptedMessage,
  updateMessage,
  getAllMessages,
  deleteMessage,
  getAllUserMessagesDecrypted,
};
