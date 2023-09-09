const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model for logged-in users
  },
  c: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model for message recipients
    required: true, // Ensure there's always a recipient
  },
  // You can add more fields like timestamps, message type, etc.
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
