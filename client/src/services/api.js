import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Sends a prompt to the backend AI endpoint.
 * @param {string} prompt - The user's question or prompt text.
 * @returns {Promise<string>} The AI-generated response text.
 */
export async function askAi(prompt) {
  const { data } = await api.post('/api/ask-ai', { prompt });
  return data.response;
}

/**
 * Persists a prompt/response pair to MongoDB via the backend.
 * @param {string} prompt - The original user prompt.
 * @param {string} response - The AI-generated response.
 * @returns {Promise<object>} The saved conversation document.
 */
export async function saveConversation(prompt, response) {
  const { data } = await api.post('/api/conversations', { prompt, response });
  return data;
}

export async function getConversations() {
  const { data } = await api.get('/api/conversations');
  return data;
}

export async function deleteConversation(id) {
  const { data } = await api.delete(`/api/conversations/${id}`);
  return data;
}
