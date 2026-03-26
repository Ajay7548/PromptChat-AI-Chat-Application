const Conversation = require('../models/Conversation');

async function saveConversation(req, res) {
  const { prompt, response } = req.body;

  if (!prompt || !response) {
    return res.status(400).json({ error: 'Both prompt and response are required.' });
  }

  const conversation = await Conversation.create({ prompt, response });
  res.status(201).json(conversation);
}

async function getConversations(req, res) {
  const conversations = await Conversation.find().sort({ createdAt: -1 });
  res.json(conversations);
}

async function deleteConversation(req, res) {
  const { id } = req.params;
  await Conversation.findByIdAndDelete(id);
  res.json({ message: 'Deleted successfully' });
}

module.exports = { saveConversation, getConversations, deleteConversation };
