const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    prompt: {
      type: String,
      required: [true, 'Prompt is required'],
    },
    response: {
      type: String,
      required: [true, 'Response is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Conversation', conversationSchema);
