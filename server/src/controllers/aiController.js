const { getAiResponse } = require('../services/openRouterService');

async function askAi(req, res) {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'Prompt is required and must be a non-empty string.' });
  }

  const answer = await getAiResponse(prompt.trim());
  res.json({ response: answer });
}

module.exports = { askAi };
