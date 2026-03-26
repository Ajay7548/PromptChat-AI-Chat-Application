import { useState, useCallback } from 'react';
import { saveConversation } from '../services/api';

/**
 * Custom hook that manages the async lifecycle for saving
 * a prompt/response pair to MongoDB via the backend.
 *
 * @returns {{ execute: (prompt: string, response: string) => Promise<object|null>, status: string, error: string|null, isLoading: boolean }}
 */
export function useSaveConversation() {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const execute = useCallback(async (prompt, response) => {
    setStatus('loading');
    setError(null);

    try {
      const data = await saveConversation(prompt, response);
      setStatus('success');
      return data;
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to save. Please try again.';
      setError(message);
      setStatus('error');
      return null;
    }
  }, []);

  return { execute, status, error, isLoading: status === 'loading' };
}
