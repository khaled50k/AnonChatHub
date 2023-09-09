const Joi = require('joi');

const commentSchema = Joi.object({
  content: Joi.string().max(1000).required(),
  userId: Joi.string().required(), // Assuming you have a user ID associated with the comment
  // You can add more fields like timestamps, comment type, etc.
});

module.exports = commentSchema;