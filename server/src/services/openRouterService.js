const axios = require('axios');
const env = require('../config/env');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL_ID = 'openrouter/free';
const REQUEST_TIMEOUT_MS = 30000;

async function getAiResponse(prompt) {
  const response = await axios.post(
    OPENROUTER_URL,
    {
      model: MODEL_ID,
      messages: [{ role: 'user', content: prompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': env.CLIENT_ORIGIN,
        'X-Title': 'AI Flow App',
      },
      timeout: REQUEST_TIMEOUT_MS,
    }
  );

  const content = response.data?.choices?.[0]?.message?.content;

  if (!content) {
    const error = new Error('No response content from AI model');
    error.statusCode = 502;
    throw error;
  }

  return content;
}

module.exports = { getAiResponse };
