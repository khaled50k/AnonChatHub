const express = require('express');
const router = express.Router();
const messageControllers = require('../../controllers/messageController');
const authMiddleware = require('../../middleware/validateSession'); // Import your authentication middleware

// Create a new encrypted message
router.post('/:senderId?', messageControllers.createEncryptedMessage);

// Update a message by ID
router.put('/:id', messageControllers.updateMessage);

// Get all messages
router.get('/', messageControllers.getAllMessages);

// Delete a message by ID
router.delete('/:id', messageControllers.deleteMessage);

// Get and decrypt messages for a specific user (recipient) by user ID
router.get('/user-messages', authMiddleware, messageControllers.getAllUserMessagesDecrypted);

module.exports = router;
