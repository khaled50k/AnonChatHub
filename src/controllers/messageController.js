const Message = require("../models/Message"); // Import your message model
const messageSchema = require("../validation/messageSchema");
// Controller for creating a new encrypted message
async function createEncryptedMessage(req, res) {
  try {
    // Check if a user is authenticated (you can use your authentication middleware)
    const authenticatedUser = req.session; // Replace this with your authentication logic
    let senderId;

    if (authenticatedUser.authenticated) {
      // If authenticated, use the user's ID as the sender
      senderId = authenticatedUser.user._id;
    } else {
      // If not authenticated, senderId will remain undefined (or null)
    }

    // Validate message input
    const { error, value } = messageSchema.validate(req.body);

    // Check for validation errors
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { content, recipient } = value;

    // Simulate key exchange (you should have recipient's public key)
    const recipientPublicKey = fetchRecipientPublicKey(recipient); // Implement this function to retrieve recipient's public key

    if (!recipientPublicKey) {
      return res.status(404).json({ error: "Recipient public key not found" });
    }

    // Encrypt the message content using the recipient's public key
    const encryptedContent = crypto.publicEncrypt(
      recipientPublicKey,
      Buffer.from(content, "utf8")
    );

    // Create a new message using the encrypted content and the senderId
    const newMessage = new Message({
      content: encryptedContent.toString("base64"),
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
}
// Controller for getting and decrypting messages for a specific user (recipient)
async function getAllUserMessagesDecrypted(req, res) {
  try {
    const userId = req.params.userId; // Assuming you have a route parameter for the user ID

    // Retrieve encrypted messages for the user
    const encryptedMessages = await Message.find({ recipient: userId });

    // Decrypt and format the messages
    const decryptedMessages = encryptedMessages.map((message) => {
      const decryptedContent = crypto.privateDecrypt(
        req.user.privateKey, // Assuming you have the user's private key in req.user
        Buffer.from(message.content, "base64")
      );

      return {
        content: decryptedContent.toString("utf8"),
        // Include other message properties like timestamps, message ID, etc.
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
